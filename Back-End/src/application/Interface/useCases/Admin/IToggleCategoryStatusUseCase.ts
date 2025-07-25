export interface IToggleCategoryStatusUseCase {
    execute(categoryId: string): Promise<void>
}