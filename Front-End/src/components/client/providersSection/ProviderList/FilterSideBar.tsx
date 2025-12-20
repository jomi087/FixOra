import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/shared/typess/category";
import { Button } from "../../../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setApplyFilters, setNearByFilter, setRatingFilter, setReset, setSelectedService } from "@/store/user/filterSlice";

interface FilterSideBarProps {
  className?: string;
  categories: Category[];
  loading: boolean;
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({ className, categories, loading }) => {
  const dispatch = useAppDispatch();
  const { selectedService, nearByFilter, ratingFilter } = useAppSelector((state) => state.filter );
  return (
    <div className={`relative flex flex-col justify-between h-full ${className}`}>
      <div className="space-y-8 overflow-y-auto p-4">
        {/* Services */}
        <div>
          <Select
            value={selectedService}
            onValueChange={(value) => dispatch(setSelectedService(value) )}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Services" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                categories.map((cat) => (
                  <SelectItem
                    key={cat.categoryId}
                    value={cat.categoryId}
                    className="cursor-pointer"
                  >
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Distance */}
        <div className="ml-4">
          <h4 className="underline mb-2 ">Near By</h4>
          <RadioGroup
            value={nearByFilter}
            onValueChange={(value: string) => dispatch(setNearByFilter(value))}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="0to5km" id="r1" className="cursor-pointer" />
              <Label htmlFor="r1">5 Km</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="0to10km" id="r2" className="cursor-pointer" />
              <Label htmlFor="r2">10 Km</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="0to15km" id="r3" className="cursor-pointer" />
              <Label htmlFor="r3">15 Km</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Rating */}
        <div className="ml-4">
          <h4 className="underline mb-2">Rating</h4>
          <RadioGroup
            value={ratingFilter}
            onValueChange={(value: string) => dispatch(setRatingFilter(value))}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="5" id="rating5" className="cursor-pointer" />
              <Label htmlFor="rating5">⭐⭐⭐⭐⭐</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="4" id="rating4" className="cursor-pointer" />
              <Label htmlFor="rating4">⭐⭐⭐⭐</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="3" id="rating3" className="cursor-pointer" />
              <Label htmlFor="rating3">⭐⭐⭐</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="2" id="rating2" className="cursor-pointer" />
              <Label htmlFor="rating2">⭐⭐</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Availability  */}
        {/* <div className="ml-4">
          <h4 className="underline mb-2">Availability</h4>
          <RadioGroup
            disabled = {true}
            value={availabilityFilter}
            onValueChange={(value: string) => dispatch(setAvailabilityFilter(value)) }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="today" id="a1" className='cursor-pointer'/>
              <Label htmlFor="a1">Today</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="tomorrow" id="a2" className='cursor-pointer'/>
              <Label htmlFor="a2">Tomorrow</Label>
            </div>
          </RadioGroup>
        </div> */}
      </div>

      <div className="absolute bottom-3 left-3 right-6 space-y-2">
        <Button
          className="w-full cursor-pointer hover:scale-105"
          variant={"success"}
          onClick={() => dispatch(setApplyFilters(true))}
        >
          Apply Filters
        </Button>

        <Button
          className="w-full cursor-pointer hover:scale-105"
          variant={"destructive"}
          onClick={() => dispatch(setReset(true))}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSideBar;
