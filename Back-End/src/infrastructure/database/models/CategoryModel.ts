import mongoose, { Document } from 'mongoose'
import { Category,Subcategory } from "../../../domain/entities/CategoryEntity.js";

export interface ICategoryModel extends Document, Category{ }

const SubcategorySchema = new mongoose.Schema<Subcategory>({
    subCategoryId :{ type: String,required: true,unique: true,trim: true,index: true},
    name: { type: String, required: true },
    description: { type: String },
    image: {type: String,required : true },
    isActive: { type: Boolean, default: false, required: true },
  },
{ timestamps: true });

const CategorySchema = new mongoose.Schema<ICategoryModel>({
    categoryId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required : true 
    },
    subcategories: [
        SubcategorySchema 
    ],
    isActive: {
        type: Boolean,
        required: true,
        default : false,
    }
},{timestamps : true})



const CategoryModel  = mongoose.model<ICategoryModel>("Category", CategorySchema);

export default CategoryModel