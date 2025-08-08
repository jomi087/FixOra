import { useState } from "react"
import SkeletonInfoCard from "../../admin/SkeletonInfoCard"
import FilterSelect from "../../common/Others/FilterSelect"
import SearchInput from "../../common/Others/SearchInput"
import { Button } from "../../ui/button"

import ProviderTandC from "./ProviderTandC"
import ProviderCard from "./ProviderCard"
import MobileFilterSideBar from "./MobileFilterSideBar"
import { useAuthProvider } from "@/hooks/useAuthProvider"
import Pagination from "@/components/common/Others/Pagination"



const filterOptions= [  
    { label: "A-z", value: "ascending" },
    { label: "Z-a", value: "descending" },
]


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
      } = useAuthProvider();
    
    const [openConfirm, setOpenConfirm] = useState(false);
    
    return (
        <div>
            <div className="bg-footer-background text-body-text w-full px-4 md:px-6 py-4">
                        
                <div className="hidden sm:flex gap-4 flex-row items-center justify-between ">              
                    <div className="flex gap-3  items-center md:w-[450px]">
                        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider"  />
                        <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} className="md:w-44"   /> 
                    </div>
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
                {/* Mobile version*/}
                <div className="space-y-4">
                    <div className="flex sm:hidden gap-4 md:flex-row  md:items-center justify-between ">
                        <MobileFilterSideBar/>             
                        <div className="md:w-auto">
                            <Button variant="default" className="bg-yellow-600">Become Providers</Button>
                        </div>
                    </div>
                    <div className="flex sm:hidden flex-row items-center justify-between gap-5">              
                        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider" />
                        <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} /> 
                    </div>            
                </div>
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
            {/* T & C */}
            <ProviderTandC openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

export default ProviderList

