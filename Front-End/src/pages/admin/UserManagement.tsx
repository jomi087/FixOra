import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import InfoCard from "@/components/admin/InfoCard";
import Pagination from "@/components/common/Pagination";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { adminSideBarOptions } from "@/utils/constant";
import type { CustromersData } from "@/shared/Types/user";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import { useDebounce } from "use-debounce";

const UserManagement: React.FC = () => {
  const [custData, setCustData] = useState<CustromersData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [debouncedQuery] = useDebounce(searchQuery,500)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getCustomerApi(debouncedQuery,filter,currentPage);
        if (res.status === 200) {
          setCustData(res.data.customersData);
          setTotalCustomers(res.data.total); 
        }
      } catch {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [debouncedQuery,filter,currentPage]);

  useEffect(() => {  //this is to reset to page 1 on  search or filter change
    setCurrentPage(1) 
  },[debouncedQuery, filter])

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={8} /> 
          </div>
          ) : (
            <div className="flex-1 bg-footer-background text-body-text">
              <SearchFilterBar 
                filterOptions={[
                  { label: "Filter", value: "all" },
                  { label: "Blocked", value: "blocked" },
                  { label: "Unblocked", value: "unblocked" },
                ]}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onFilter={setFilter} 
                filter={filter}
              />

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

