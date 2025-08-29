import { Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle,SheetTrigger } from "@/components/ui/sheet";
import { IoIosOptions } from "react-icons/io";
import FilterSideBar from "./FilterSideBar";
import { useAppSelector } from "@/store/hooks";

const MobileFilterSideBar: React.FC = () => {
  const { categories , loading } = useAppSelector((state)=>state.category);
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <IoIosOptions size={24}/>
        </SheetTrigger> 
        <SheetContent side="left" className="w-[230px] overflow-auto">
          <SheetHeader className="mb-0 pb-0 ">
            <SheetTitle>Options</SheetTitle> 
            <SheetDescription>
                            Filter providers by services, distance, and rating.
            </SheetDescription>
          </SheetHeader>
          <FilterSideBar className="block" categories={categories} loading={loading} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileFilterSideBar;
