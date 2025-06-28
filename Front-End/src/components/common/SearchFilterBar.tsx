import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import type { ReactNode } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  filterOptions: FilterOption[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onFilter: (value: string) => void;
  filter: string;
  rightSlot?: ReactNode;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({filterOptions,searchQuery,onSearch,onFilter,filter,rightSlot,}) => {
  return (
    <div className="w-full px-4 md:px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left side: Search + Filter */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-auto">
          {/* Search Input */}
          <div className="w-full md:w-[280px]">
            <Label htmlFor="search" className="sr-only">
              Search User
            </Label>
            <Input
              id="search"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="dark:bg-foreground dark:text-background"
            />
          </div>

          {/* Filter Select */}
          <div className="w-full md:w-[200px]">
            <Label htmlFor="filter" className="sr-only">Filter</Label>
            <Select value={filter} onValueChange={onFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right side: Optional button or slot */}
        {rightSlot && (
          <div className="w-full md:w-auto">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
