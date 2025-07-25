import { Category } from "../../entities/CategoryEntity.js";

export interface ICategoryRepository{
    create(category: Category): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    findById(id: string): Promise<Category>;
    save(category: Category): Promise<Category>; 
    
    findActiveCategories(omitFields?: Array<keyof Category>): Promise<Partial<Category>[]>;
    findActiveCategoriesWithActiveSubcategories(): Promise<Partial<Category>[]>;

    findServicesWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
        omitFields?: Array<keyof Category>
    ) : Promise<{ data: Partial<Category>[]; total: number }>;
}