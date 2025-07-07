import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { CategoryDTO, SubcategoryDTO } from "../../../domain/outputDTO's/CategoryDTO.js";
import { CategoryInputDTO } from "../../InputDTO's/CategoryInputDTO.js";
import { v4 as uuidv4 } from "uuid";


interface Data  {
  body: CategoryInputDTO,
  files : Express.Multer.File[],
}

export class CreateServiceCategoryUseCase {
    constructor(
      private readonly imageUploaderService: IImageUploaderService,
      private readonly categoryRepository : ICategoryRepository
    ) {}
    
    async execute(input : Data ):Promise<void> {    
      try {         
        // console.log("input", input)
        const { body, files } = input

        //validation
        if (!body.name || typeof body.name !== 'string') {
          throw { status: 400, message: "Category name is required and must be a string." };
        }

        const normalizedCategoryName = body.name.trim().toLowerCase();
        if(await this.categoryRepository.findByName(normalizedCategoryName)) throw { status: 400, message: `Category "${body.name}" already exists.` };


        if (!body.description || typeof body.description !== 'string') {
          throw { status: 400, message: "Category description is required and must be a string." };
        }

        if (!Array.isArray(body.subcategories) || body.subcategories.length === 0) {
          throw { status: 400, message: "At least one subcategory is required." };
        }

        for (let i = 0; i < body.subcategories.length; i++) {
          const sub = body.subcategories[i];

          if (!sub.name || typeof sub.name !== 'string') {
            throw { status: 400, message: `Subcategory ${i + 1} is missing a valid name.` };
          }

          if (!sub.description || typeof sub.description !== 'string') {
            throw { status: 400, message: `Subcategory ${i + 1} is missing a valid description.` };
          }

          const subImageFile = files.find(file => file.fieldname === `subcategories[${i}][image]`);
          if (!subImageFile) {
            throw { status: 400, message: `Subcategory ${i + 1} image is missing.` };
          }
        }


        const mainImageFile = files.find((file)=>file.fieldname === "image")
        if (!mainImageFile) throw { status: 500, message: `Error : Issue foundd on Main Categoryimage File ` }
        const mainImageUrl = await this.imageUploaderService.uploadImage(mainImageFile.buffer)

        const subCategories = await Promise.all(
          body.subcategories.map(async(subCategory, index) => {
            const subImageFile = files.find((file) => file.fieldname === `subcategories[${index}][image]`)
            
            if (!subImageFile) throw { status: 500, message: `Error : Issue foundd on Sub Categoryimage File ` }
            const subImageUrl  = await this.imageUploaderService.uploadImage(subImageFile.buffer)
          
            return {
              subCategoryId: uuidv4(),
              name: subCategory.name,
              description: subCategory.description,
              image: subImageUrl,
            } as SubcategoryDTO
          })
        )

        const category: CategoryDTO = {
          categoryId: uuidv4(),
          name: normalizedCategoryName ,
          description: body.description,
          image: mainImageUrl,
          subcategories : subCategories
        }

        await this.categoryRepository.create(category) 

      } catch (error:any) {
          if (error.status && error.message) {
              throw error;
          }
          throw { status: 500, message: 'Category adding  failed, (something went wrong)'};
      }
    }
}