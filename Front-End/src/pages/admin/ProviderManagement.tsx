import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import Pagination from "@/components/common/Others/Pagination";
import { adminSideBarOptions, Messages } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { useProviderManagement } from "@/hooks/useProviderManagement";
import SearchInput from "@/components/common/Others/SearchInput";
import FilterSelect from "@/components/common/Others/FilterSelect";
import { useNavigate } from "react-router-dom";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { toast } from "react-toastify";
import ProviderInfoCard from "@/components/admin/providerManagment/ProviderInfoCard";


const filterOptions= [
  { label: "All", value: "all" },
  { label: "Blocked", value: "blocked" },
  { label: "Unblocked", value: "unblocked" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

const ProviderManagement: React.FC = () => {
  
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
    setData: setProvData
  } = useProviderManagement();


  const handleToggleStatus = async (userId: string) => {
    try {
      
      const res = await AuthService.toggleUserStatusApi(userId);
      if (res.status === HttpStatusCode.OK) {
        setProvData(prev =>
          prev.map((data) => data.user.userId === userId ? {
            ...data,
            user: {
              ...data.user,
              isBlocked: !data.user.isBlocked
            }
          } : data )
        );
      }
    } catch (error: any) {
      console.log(error);
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS ;
      toast.error(errorMsg);
    }
  };

  const navigate = useNavigate();
  
  
  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />

      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">

        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />

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
                onClick={()=>{navigate("/admin/provider-request");}}
              >
                  Verify Providers
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex-1 bg-footer-background text-body-text">
              <SkeletonInfoCard count={8} />
            </div> 
          ) : provData.length === 0 ? (
            <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                No providers have been registered yet
            </div>
          ) : (
            <>
              <ProviderInfoCard
                datas={provData}
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

export default ProviderManagement;
