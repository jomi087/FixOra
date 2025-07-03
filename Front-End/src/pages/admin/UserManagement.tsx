import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import InfoCard from "@/components/admin/InfoCard";
import Pagination from "@/components/common/Others/Pagination";
//import SearchFilterBar from "@/components/common/SearchFilterBar";
import { adminSideBarOptions } from "@/utils/constant";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import { useUserManagement } from "@/hooks/useUserManagementHook";
import FilterSelect from "@/components/common/Others/FilterSelect";
import SearchInput from "@/components/common/Others/SearchInput";

const UserManagement: React.FC = () => {
  const { custData,isLoading,totalCustomers,setSearchQuery,filter,setFilter,currentPage,searchQuery,setCurrentPage,itemsPerPage}=useUserManagement()
  
  const filterOptions = [
    { label: "Filter", value: "all" },
    { label: "Blocked", value: "blocked" },
    { label: "Unblocked", value: "unblocked" },
  ]

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={itemsPerPage} /> 
          </div>
          ) : (
            <div className="flex-1  bg-footer-background text-body-text w-full px-4 md:px-0 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mx-5 ">
                <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-[240px]">
                  <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search User" />
                </div>
                <div className="w-full md:w-auto">
                  <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} /> 
                </div>
              </div>

              {custData.length === 0 ? (
                <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                  No Customer's found.
                </div>
                ) : (
                  <>
                    <InfoCard
                      datas={custData}
                      type="customer"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalCustomers  / itemsPerPage)}
                      onPage={setCurrentPage}
                    />
                  </>
                )
              }
            </div>
          )
        }
      </div>  
    </>
  );
};

export default UserManagement;

