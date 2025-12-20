import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import CategoryBaseForm from "./CategoryBaseForm";
import { toast } from "react-toastify";
import { validateCategoryName, validateDescription } from "@/utils/validation/categoryValidation";
import { validateImage } from "@/utils/validation/imageValidation";
import { categoryImageSize, Messages } from "@/utils/constant";
import AuthService from "@/services/AuthService";
import type { AxiosError } from "axios";
import type { Category } from "@/shared/typess/category";

interface Errors {
  name: string;
  description: string;
  image: string;
}

interface Props {
  category: {
    categoryId: string
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  onUpdateCategory: (onUpdateCategory: Category) => void
}

const EditCategoryDialoge: React.FC<Props> = ({ category, onUpdateCategory }) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({
    name: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(category.name);
      setDescription(category.description ?? "");
      setImage(null);
      setErrors({ name: "", description: "", image: "" });
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSame = (
      category.name === name &&
      category.description === description &&
      image === null
    );

    if (isSame) {
      toast.info("No changes Made.");
      return;
    }

    const nameError = validateCategoryName(name);
    const descriptionError = validateDescription(description);
    const imageError = image ? validateImage(image, categoryImageSize) : null;

    const hasError = nameError || descriptionError || imageError;
    if (hasError) {
      setErrors({
        name: nameError || "",
        description: descriptionError || "",
        image: imageError || "",
      });
      return;
    }

    setErrors({ name: "", description: "", image: "" });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await AuthService.updateCategory(formData, category.categoryId);
      const updated = res.data.updatedCategory;
      onUpdateCategory(updated);
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err?.response?.data?.message || Messages.FAILED_TO_UPDATE;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:scale-125"
          size="sm"
          onClick={(e) => e.stopPropagation()}
        >
          <CiEdit size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <CategoryBaseForm
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onImageChange={setImage}
            errors={errors}
          />

          <div className="flex justify-between items-end-safe">
            <img
              src={image ? URL.createObjectURL(image) : category.image}
              className="w-36 h-36 object-cover rounded-md"
              alt="img"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving" : "Save"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditCategoryDialoge;
