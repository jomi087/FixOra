import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { shortInputLength, longInputLength, Messages } from "@/utils/constant";
import type { AxiosError } from "axios";

interface AddCategoryProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerRefresh: () => void;
}

const AddCategoryDialoge: React.FC<AddCategoryProps> = ({ open, setOpen, triggerRefresh }) => {
  const { name, setName, description, setDescription, setImage, subcategories, errors, loading, setLoading, handleAddSubcategory, handleSubcategoryChange, handleRemoveSubcategory, validate, createFormData, } = useCategoryForm();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    const formData = createFormData();
    try {
      const res = await AuthService.addCategoryApi(formData);

      if (res.status == HttpStatusCode.OK) {
        toast.success(res.data.message);
        triggerRefresh();
        setOpen(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err?.response?.data?.message || Messages.FAILED_CATEGORY_RESPONSE_MSG;
      toast.error(errorMsg);

    } finally {
      setLoading(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Service</Button>
      </DialogTrigger>

      <DialogContent className="h-full overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add Service Category</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new category with optional subcategories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                maxLength={shortInputLength}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                maxLength={longInputLength}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="cImage">Image</Label>
              <Input
                type="file"
                id="cImage"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className={errors.image ? "border-red-500" : ""}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            <div className="grid gap-3">
              <Label>Subcategories</Label>
              {subcategories.map((sub, index) => (
                <div key={index} className="border p-3 rounded-md space-y-2">
                  <Input
                    placeholder={`Subcategory ${index + 1} Name`}
                    value={sub.name}
                    onChange={(e) =>
                      handleSubcategoryChange(index, "name", e.target.value)
                    }
                    className={
                      errors.subcategories[index] ? "border-red-500" : ""
                    }
                    maxLength={shortInputLength}
                  />
                  <Textarea
                    placeholder="Description"
                    value={sub.description}
                    onChange={(e) =>
                      handleSubcategoryChange(index, "description", e.target.value)
                    }
                    className={
                      errors.subcategories[index] ? "border-red-500" : ""
                    }
                    maxLength={longInputLength}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSubcategoryChange(
                        index,
                        "image",
                        e.target.files?.[0] || null
                      )
                    }
                    className={
                      errors.subcategories[index] ? "border-red-500" : ""
                    }
                  />
                  {errors.subcategories[index] && (
                    <p className="text-sm text-red-500">
                      {errors.subcategories[index]}
                    </p>
                  )}
                  {subcategories.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveSubcategory(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSubcategory}
              >
                + Add Subcategory
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialoge;
