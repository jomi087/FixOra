// src/hooks/useCategoryForm.ts
import { useState } from "react";
import { validateImage } from "@/utils/validation/imageValidation";
import { validateCategoryName, validateDescription } from "@/utils/validation/categoryValidation";
import { categoryImageSize } from "@/utils/constant";

export interface SubcategoryForm {
  name: string;
  description: string;
  image: File | null;
}

interface Errors {
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}

export const useCategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [subcategories, setSubcategories] = useState<SubcategoryForm[]>([
    { name: "", description: "", image: null },
  ]);
  const [errors, setErrors] = useState<Errors>({
    name: "",
    description: "",
    image: "",
    subcategories: [],
  });
  const [loading, setLoading] = useState(false);

  const handleAddSubcategory = () => {
    setSubcategories((prev) => [
      ...prev,
      { name: "", description: "", image: null },
    ]);
  };

  const handleSubcategoryChange = <K extends keyof SubcategoryForm>(
    index: number,
    field: K,
    value: SubcategoryForm[K]
  ) => {
    setSubcategories((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const nameError = validateCategoryName(name);
    const descriptionError = validateDescription(description);
    const imageError = validateImage(image, categoryImageSize);

    const subErrors = subcategories.map((sub) => {
      const subNameError = validateCategoryName(sub.name);
      const subDescError = validateDescription(sub.description);
      const subImageError = validateImage(sub.image, categoryImageSize);
      return subNameError || subDescError || subImageError || null;
    });

    const hasError = nameError || descriptionError || imageError || subErrors.some(Boolean);
    if (hasError) {
      setErrors({
        name: nameError || "",
        description: descriptionError || "",
        image: imageError || "",
        subcategories: subErrors.map((err) => err || ""),
      });
      return false;
    }

    setErrors({ name: "", description: "", image: "", subcategories: [] });
    return true;
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    formData.append(
      "subcategories",
      JSON.stringify(
        subcategories.map(sub => ({
          name: sub.name,
          description: sub.description,
        }))
      )
    );

    subcategories.forEach(sub => {
      if (sub.image) {
        formData.append("subcategoryImages", sub.image);
      }
    });
    
    return formData;
  };

  return {
    name,
    setName,
    description,
    setDescription,
    image,
    setImage,
    subcategories,
    errors,
    loading,
    setLoading,
    handleAddSubcategory,
    handleSubcategoryChange,
    handleRemoveSubcategory,
    validate,
    createFormData,
  };
};
