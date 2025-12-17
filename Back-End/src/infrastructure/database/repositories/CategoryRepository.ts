import { Category, Subcategory } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import CategoryModel from "../models/CategoryModel";
import { FilterQuery } from "mongoose";

export class CategoryRepository implements ICategoryRepository {

    async create(category: Category): Promise<Category> {
        const newCategory = new CategoryModel(category);
        await newCategory.save();
        return newCategory.toObject() as Category;
    }

    async findByName(name: string): Promise<Category | null> {
        return await CategoryModel.findOne({
            name: { $regex: `^${name.trim()}$`, $options: "i" }
        }).lean<Category>();
    }

    async findById(id: string): Promise<Category | null> {
        const category = await CategoryModel.findOne({ categoryId: id }).lean<Category>();
        return category;
    }

    async save(category: Category): Promise<Category> {
        const categoryDoc = await CategoryModel.findOne({ categoryId: category.categoryId });
        if (!categoryDoc) throw new Error("Category not found");

        categoryDoc.set(category); // overwrite fields
        const saved = await categoryDoc.save();
        return saved.toObject() as Category;
    }


    async findActiveCategories(omitFields: Array<keyof Category> = []): Promise<Partial<Category>[]> {
        const omitSelect = omitFields?.map(field => `-${field}`).join(" ");
        return await CategoryModel.find({ isActive: true }, { _id: 0, __v: 0 }).select(omitSelect).lean<Partial<Category>[]>();
    }


    async findActiveCategoriesWithActiveSubcategories(): Promise<Category[]> {
        const categories = await CategoryModel.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: 1, name: 1, description: 1, image: 1, isActive: 1, createdAt: 1, updatedAt: 1,
                    subcategories: {
                        $filter: {
                            input: "$subcategories",
                            as: "sub",
                            cond: { $eq: ["$$sub.isActive", true] }
                        }
                    }
                }
            }
        ]);
        return categories as Category[];
    }


    async findServicesWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
        omitFields: Array<keyof Category> = []
    ): Promise<{ data: Partial<Category>[]; total: number }> {
        const { searchQuery, filter } = options;
        const query: FilterQuery<Category> = {};
        //if (searchQuery) { query.fname = { $regex: searchQuery, $options: "i" }; }

        if (searchQuery.trim()) {
            query.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { "subcategories.name": { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (filter === "Active") {
            query.isActive = true;
        } else if (filter === "Un-Active") {
            query.isActive = false;
        }
        const omitSelect = omitFields.map(field => `-${field}`).join(" ");

        const total = await CategoryModel.countDocuments(query);
        const cartegories = await CategoryModel.find(query, { _id: 0, __v: 0 })
            .select(omitSelect)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .lean<Partial<Category>[]>();

        return { data: cartegories, total };
    }

    async dashboardServiceStats(start: Date, end: Date): Promise<{
        totalServices: number;
        blockedServices: number;
        newServices: number;
    }> {
        const [totalServices, blockedServices, newServices] = await Promise.all([
            CategoryModel.countDocuments({}),
            CategoryModel.countDocuments({ isActive: false }),
            CategoryModel.countDocuments({ createdAt: { $gte: start, $lte: end } })
        ]);

        return {
            totalServices,
            blockedServices,
            newServices,
        };
    }

    async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
        let result = await CategoryModel.findOneAndUpdate(
            { categoryId: id },
            data,
            { new: true }
        ).lean();

        if (!result) return null;

        return {
            categoryId: result.categoryId,
            name: result.name,
            description: result.description,
            image: result.image,
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            subcategories: result.subcategories?.map((sub: Subcategory) => ({
                subCategoryId: sub.subCategoryId,
                name: sub.name,
                description: sub.description,
                image: sub.image,
                isActive: sub.isActive,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
            })) || []
        };
    }

    async updateSubCategory(id: string, data: Partial<Subcategory>): Promise<Category | null> {
        let result = await CategoryModel.findOneAndUpdate(
            { "subcategories.subCategoryId": id },
            {
                $set: {
                    "subcategories.$.name": data.name,
                    "subcategories.$.description": data.description,
                    ...(data.image && { "subcategories.$.image": data.image }),
                    "subcategories.$.updatedAt": new Date()
                }
            },
            { new: true }
        ).lean();

        if (!result) return null;

        return {
            categoryId: result.categoryId,
            name: result.name,
            description: result.description,
            image: result.image,
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            subcategories: result.subcategories?.map((sub: Subcategory) => ({
                subCategoryId: sub.subCategoryId,
                name: sub.name,
                description: sub.description,
                image: sub.image,
                isActive: sub.isActive,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
            })) || []
        };
    }

    async findCategoryBySubCategoryId(subCategoryId: string): Promise<Category | null> {
        let result = await CategoryModel.findOne({
            "subcategories.subCategoryId": subCategoryId
        }).lean();

        if (!result) return null;

        return {
            categoryId: result.categoryId,
            name: result.name,
            description: result.description,
            image: result.image,
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            subcategories: result.subcategories?.map((sub: Subcategory) => ({
                subCategoryId: sub.subCategoryId,
                name: sub.name,
                description: sub.description,
                image: sub.image,
                isActive: sub.isActive,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
            })) || []
        };
    }
}