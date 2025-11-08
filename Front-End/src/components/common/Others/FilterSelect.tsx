import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  filter: string;
  onChange: (val: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string
}

const FilterSelect: React.FC<FilterSelectProps> = ({ filter,onChange,options,placeholder="Sort",className }) => {
  return (
    <div >
      <Label className="sr-only">Filter</Label>
      <Select value={filter} onValueChange={onChange}>
        <SelectTrigger  className={`${className}`}>
          <SelectValue placeholder={placeholder} /> 
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;
