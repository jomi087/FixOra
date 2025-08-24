import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchInputMaxLength } from "@/utils/constant";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = React.memo(({ value, onChange, placeholder = "Search...", }) => {
  return (
    <div className="w-full">
      <Label className="sr-only">Search</Label>
      <Input
        maxLength={searchInputMaxLength} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dark:bg-foreground dark:text-background"
      />
    </div>
  );
});

export default SearchInput;


