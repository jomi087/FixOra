import { Category, Subcategory } from "../../entities/CategoryEntity";

export interface ICategoryRepository {
    create(category: Category): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    findById(id: string): Promise<Category | null>;
    save(category: Category): Promise<Category>;

    findActiveCategories(omitFields?: Array<keyof Category>): Promise<Partial<Category>[]>;
    findActiveCategoriesWithActiveSubcategories(): Promise<Category[]>;

    findServicesWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
        omitFields?: Array<keyof Category>
    ): Promise<{ data: Partial<Category>[]; total: number }>;

    dashboardServiceStats(start: Date, end: Date): Promise<{
        totalServices: number;
        blockedServices: number;
        newServices: number;
    }>;

    updateCategory(id: string, data: Partial<Category>): Promise<Category | null>;
    updateSubCategory(id: string, data: Partial<Subcategory>): Promise<Category | null>;
    findCategoryBySubCategoryId(subCategoryId: string): Promise<Category | null>;
}