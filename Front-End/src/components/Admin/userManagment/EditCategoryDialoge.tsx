import { Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogFooter,DialogClose, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Category } from "@/shared/Types/category";
import { Textarea } from "../../ui/textarea";
import { CiEdit } from "react-icons/ci";
import { longInputLength, shortInputLength } from "@/utils/constant";

interface SubcategoryForm {
  name: string;
  description: string;
  image: File | null;
}


interface Props {
  category: Category;
}

const EditCategoryDialoge: React.FC<Props> = ({ category }) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [subcategories, setSubcategories] = useState<SubcategoryForm[]>(
    category.subcategories?.map((sub) => ({
      name: sub.name,
      description: sub.description ?? "",
      image: null  
    })) ?? []
  );

  const handleSubcategoryChange = (index: number, field: keyof SubcategoryForm, value: string | File | null) => {
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

  const handleAddSubcategory = () => {
    setSubcategories([
      ...subcategories,
      { name: "", description: "", image: null },
    ]);
  };

  const handleRemoveSubcategory = (index: number) => {
    const updated = [...subcategories];
    updated.splice(index, 1);
    setSubcategories(updated);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, image, subcategories });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:scale-125" size="sm">
          <CiEdit />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-full overflow-y-scroll" >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={shortInputLength}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={longInputLength}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Change Image</Label>
              <Input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>
                  
          <div className="grid gap-3 mt-4">
            <Label>Subcategories</Label>
            {subcategories.map((sub, index) => (
              <div key={index} className="border p-3 rounded-md space-y-2">
                <Input
                  placeholder={`Subcategory ${index + 1} Name`}
                  value={sub.name}
                  onChange={(e) => handleSubcategoryChange(index, "name", e.target.value) }
                  required
                  maxLength={shortInputLength}
                />
                <Textarea
                  placeholder="Description"
                  value={sub.description}
                  onChange={(e) => handleSubcategoryChange(index, "description", e.target.value) }
                  required
                  maxLength={longInputLength}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>handleSubcategoryChange( index, "image", e.target.files?.[0] || null ) }
                  required
                />
                {subcategories.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={()=> handleRemoveSubcategory(index) }
                    >
                                Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={handleAddSubcategory } >
                    + Add Subcategory
            </Button>
          </div>
                  


          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialoge;
