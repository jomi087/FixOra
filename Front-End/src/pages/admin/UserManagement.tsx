import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import UserInfoCard from "@/components/admin/userManagment/UserInfoCard";
import Pagination from "@/components/common/Others/Pagination";
import { adminSideBarOptions, Messages } from "@/utils/constant";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import { useUserManagement } from "@/hooks/useUserManagementHook";
import FilterSelect from "@/components/common/Others/FilterSelect";
import SearchInput from "@/components/common/Others/SearchInput";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";


const UserManagement: React.FC = () => {
  const { custData,isLoading,totalPages,setSearchQuery,filter,setFilter,currentPage,searchQuery,setCurrentPage,itemsPerPage,setCustData}=useUserManagement()
  
  const filterOptions = [
    { label: "Filter", value: "all" },
    { label: "Blocked", value: "blocked" },
    { label: "Unblocked", value: "unblocked" },
  ]

  const handleToggleStatus = async (userId: string) => {
    try {      
      const res = await AuthService.toggleUserStatusApi(userId)
      if (res.status === HttpStatusCode.OK) {
        setCustData(prev =>
          prev.map((data) => data.userId === userId ? {
            ...data,
            isBlocked: !data.isBlocked
          }: data )
        )
      }
    } catch (error: any) {
      console.log(error)
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS ;
      toast.error(errorMsg);
    }
  }

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        
        <div className="flex-1  bg-footer-background text-body-text w-full px-4 md:px-0 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mx-5 ">
            <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-[240px]">
              <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search User" />
            </div>
            <div className="w-full md:w-auto">
              <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} /> 
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 bg-footer-background text-body-text">
              <SkeletonInfoCard count={itemsPerPage} /> 
            </div>
          ) : custData.length === 0 ? (
            <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
              No Customer's found.
            </div>
          ) : (
            <>
              <UserInfoCard
                datas={custData}
                onToggleStatus={handleToggleStatus}
              />
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
      </div>  
    </>
  );
};

export default UserManagement;

