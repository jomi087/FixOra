import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Errors {
  name: string;
  description: string;
  image: string;
}

interface BaseFormProps {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onImageChange: (file: File | null) => void;
  errors: Errors
}

const CategoryBaseForm = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onImageChange,
  errors,
}: BaseFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-1">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      </div>

      <div className="grid gap-1">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid gap-1">
        <Label>Image</Label>
        <Input
          type="file"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

    </div>
  );
};

export default CategoryBaseForm;
