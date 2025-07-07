import { CategoryDTO } from "../../../domain/outputDTO's/CategoryDTO.js";
import { Category } from "../../../domain/entities/CategoryEntity.js";
import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import CategoryModel from "../models/CategoryModel.js";

export class CategoryRepository implements ICategoryRepository {

    async create(category: CategoryDTO): Promise < Category > {
        const newCategory = new CategoryModel(category)
        await newCategory.save();
        return newCategory.toObject() as Category;
    }

    async findByName(name: string): Promise<Category | null> {
        return await CategoryModel.findOne({
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        }).lean()
    }

    async findById(id: string): Promise<Category>{  
        const category = await CategoryModel.findOne({categoryId : id }).lean()
        if (!category) throw new Error("Category not found");
        return category
    }

    async save(category: Category): Promise<Category> {
        const categoryDoc = await CategoryModel.findOne({categoryId : category.categoryId });
        if (!categoryDoc) throw new Error("Category not found");

        categoryDoc.set(category); // overwrite fields
        const saved = await categoryDoc.save();
        return saved.toObject() as Category;
    }


    async findServicesWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number,limit: number,
        omitFields: Array<keyof Category> = []
    ): Promise<{ data: Partial<Category>[]; total: number }> {
        const { searchQuery, filter } = options
        const query: any = {};
        //if (searchQuery) { query.fname = { $regex: searchQuery, $options: "i" }; }

        if (searchQuery.trim()) {
            query.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { "subcategories.name" : { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (filter === "Active") {
            query.isActive = true
        } else if (filter === "Un-Active") {
            query.isActive = false
        }
        const omitSelect = omitFields.map(field => `-${field}`).join(' ');

        const total = await CategoryModel.countDocuments(query);
        const cartegories = await CategoryModel.find(query)
            .select(omitSelect)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .lean<Partial<Category>[]>();

        return { data : cartegories, total}
    }
    
}