import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/shared/Types/category";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters, setAvailabilityFilter, setNearByFilter, setRatingFilter, setSelectedService } from "@/store/user/filterSlice";

interface FilterSideBarProps {
  className?: string;
  categories: Category[];
  loading: boolean;
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({ className, categories, loading }) => {
    const dispatch = useAppDispatch();
    const { selectedService, nearByFilter, availabilityFilter, ratingFilter } = useAppSelector((state) => state.filter );

  return (
    <>
      <div className={`overflow-hidden transition-transform  shrink-0 ${className}`}>
        <div className="space-y-5">
          <div className="mx-2 mt-3 text-base font-medium  " >
            {/* Services */}
            <Select value={selectedService} onValueChange={(value)=>dispatch(setSelectedService(value)) }>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Services" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId} className="cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="px-8 text-base font-medium space-y-5">
            {/* Distance */}
            <div>
              <h4 className="underline mb-2">Near By</h4>
              <RadioGroup
                value={nearByFilter}
                onValueChange={(value: string) => dispatch(setNearByFilter(value))}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="5km" id="r1" className='cursor-pointer' />
                  <Label htmlFor="r1">5 Km</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="5to10km" id="r2" className='cursor-pointer'  />
                  <Label htmlFor="r2">5–10 Km</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="10to15km" id="r3" className='cursor-pointer'  />
                  <Label htmlFor="r3">10–15 Km</Label>
                </div>
              </RadioGroup>
            </div>
            {/* Availability */}
            <div>
              <h4 className="underline mb-2">Availability</h4>
              <RadioGroup
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
            </div>
            {/* Rating */}
            <div>
              <h4 className="underline mb-2">Rating</h4>
              <RadioGroup
                value={ratingFilter}
                onValueChange={(value: string) => dispatch(setRatingFilter(value))}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="5" id="rating5" className='cursor-pointer' />
                  <Label htmlFor="rating5">⭐⭐⭐⭐⭐</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="4" id="rating4" className='cursor-pointer'  />
                  <Label htmlFor="rating4">⭐⭐⭐⭐</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="3" id="rating3" className='cursor-pointer'  />
                  <Label htmlFor="rating3">⭐⭐⭐</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="2" id="rating2" className='cursor-pointer'  />
                  <Label htmlFor="rating2">⭐⭐</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="mx-2" >
            {/* Reset Button */}
            <Button
              className="w-full cursor-pointer hover:scale-105 hover:rotate-360 transition-transform"
              variant={"destructive"}
              onClick={()=>dispatch(resetFilters())} >
              Reset All Filters
            </Button>
          </div> 
        </div>
      </div>
    </>

  );
};

export default FilterSideBar;
