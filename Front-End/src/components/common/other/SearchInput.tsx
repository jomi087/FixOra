import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchInputLength } from "@/utils/constant";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = React.memo(
  ({ value, onChange, placeholder = "Search...", className = "w-full" }) => {
    return (
      <div className={`relative ${className}`}>
        <Label className="sr-only">Search</Label>

        <Input
          maxLength={searchInputLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dark:bg-foreground dark:text-background pr-8 sm:min-w-44 md:min-w-56"
        />

        {value && (
          <p
            onClick={() => onChange("")}
            className="absolute -right-0 top-1/2 -translate-y-1/2 text-sm px-2 text-black hover:text-black hover:cursor-pointer border-0"
          >
            ×
          </p>
        )}
      </div>
    );
  }
);

export default SearchInput;
