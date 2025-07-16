import InfoCard from "@/components/admin/InfoCard";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import Pagination from "@/components/common/Others/Pagination";
import { adminSideBarOptions } from "@/utils/constant";
//import {  ProvidersData } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { useProviderManagement } from "@/hooks/useProviderManagement";
import SearchInput from "@/components/common/Others/SearchInput";
import FilterSelect from "@/components/common/Others/FilterSelect";
import { useNavigate } from "react-router-dom";


const ProviderManagement: React.FC = () => {
  
  const { provData,isLoading,totalProviders,setSearchQuery,filter,setFilter,currentPage,searchQuery,setCurrentPage,itemsPerPage}=useProviderManagement()
  const filterOptions= [
    { label: "All", value: "all" },
    { label: "Blocked", value: "blocked" },
    { label: "Unblocked", value: "unblocked" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ]
  
  const totalPages = Math.ceil(totalProviders / itemsPerPage)
  const navigate = useNavigate()
  
  
  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={8} />
          </div>
        ) :  (
          <div className="flex-1  bg-footer-background text-body-text w-full px-4 md:px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
              <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-[480px]">
                <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider" />
                <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} /> 
              </div>
              <div className="w-full md:w-auto">
                  <Button
                    variant="default"
                    className="bg-yellow-600"
                    onClick={()=>{navigate('/admin/provider-request')}}
                  >Verify Providers
                  </Button>
              </div>
            </div>
            
            { provData.length === 0 ? (
              <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                No providers have been registered yet
              </div>
              
            ) : (
              <>
                <InfoCard datas={provData} type="provider" />
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
        )}
      </div>
    </>
  );
};

export default ProviderManagement

/*
  const filteredProviders = useMemo(()=>{  //implimented useMemo for optimization and debounce
    
    return provData.filter((user) => {  
      const matchSearch = user.fname?.toLowerCase().includes(debouncedQuery.toLowerCase())&& user.kycInfo.status === KYCStatus.Approved
      let  matchFilter = true;
      if (filter === "blocked") {   //isBlocked = true
        matchFilter = user.isBlocked;
      } else if (filter === "unblocked") {
        matchFilter = !user.isBlocked;
      } else if (filter === "online") {
        matchFilter = user.isOnline
      } else if (filter === "offline") {
        matchFilter = !user.isOnline
      }
      return matchSearch && matchFilter
    })
  }, [debouncedQuery, filter, provData])
  
  const paginatiedProvider = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProviders.slice(start, start + itemsPerPage)
  },[filteredProviders,currentPage])
  */