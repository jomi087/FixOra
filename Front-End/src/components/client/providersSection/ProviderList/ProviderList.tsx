import { useState } from "react";
import SkeletonInfoCard from "../../../admin/SkeletonInfoCard";
import FilterSelect from "../../../common/others/FilterSelect";
import SearchInput from "../../../common/others/SearchInput";
import { Button } from "../../../ui/button";

import ProviderCard from "./ProviderCard";
// import MobileFilterSideBar from "./MobileFilterSideBar";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import Pagination from "@/components/common/others/Pagination";
import { MapPinPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LocationPicker from "../providerApplication/LocationPicker";
import type { AppLocation } from "@/shared/types/location";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Messages } from "@/utils/constant";
import AuthService from "@/services/AuthService";


const filterOptions = [
  { label: "name ascending", value: "ascending" },
  { label: "name descending", value: "descending" },
];

// will add later
// const filterOptions = [
//   { label: "Name ↑", value: "name_asc" },
//   { label: "Name ↓", value: "name_desc" },
//   { label: "Rating ↑", value: "rating_asc" },
//   { label: "Rating ↓", value: "rating_desc" },
//   { label: "Price ↑", value: "price_asc" },
//   { label: "Price ↓", value: "price_desc" }
// ];


const ProviderList = () => {
  const {
    data: provData,
    isLoading,
    totalPages,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    setLocation,
    selectedAddress, setSelectedAddress
  } = useAuthProvider();

  const [openPicker, setOpenPicker] = useState(false);

  const handleSaveLocation = async (loc: AppLocation) => {
    try {
      await AuthService.saveLocation(loc);
      setLocation(loc);
      setSelectedAddress(loc.address);
      setOpenPicker(false);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_SAVE_DATA;
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div className="bg-footer-background text-body-text w-full px-4 md:px-6 py-4">

        <div className="hidden sm:flex gap-4 flex-row items-center justify-between ">
          <div className="flex gap-3  items-center md:w-[450px]">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider" />
            <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} className="md:w-44" />

          </div>
          <div className="">
            {selectedAddress && <span
              className="text-[13px] font-roboto underline underline-offset-4 mr-2"
            >
              {`${selectedAddress?.split(",")[0]}`}
            </span>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="font-light"
                    onClick={() => setOpenPicker(true)}
                  >
                    <MapPinPlus/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p >Use Current Location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {openPicker &&
              <LocationPicker
                open={openPicker}
                onClose={() => setOpenPicker(false)}
                onSave={handleSaveLocation}
              />
            }
          </div>
        </div>

        {/* Mobile version*/}
        {/* <div className="space-y-4">
          <div className="flex sm:hidden gap-4 md:flex-row  md:items-center justify-between ">
            <MobileFilterSideBar />
            <div className="md:w-auto">
              <Button
                variant="default"
                className="bg-yellow-600"
                onClick={() => setOpenConfirm(true)}
              >
                Become Providers
              </Button>
            </div>
          </div>
          <div className="flex sm:hidden flex-row items-center justify-between gap-5">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider" />
            <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} />
          </div>
        </div> */}

        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={8} />
          </div>
        ) : provData.length === 0 ? (
          <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
            No providers Found . . .
          </div>
        ) : (
          <>
            <ProviderCard datas={provData} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

    </div >
  );
};

export default ProviderList;

