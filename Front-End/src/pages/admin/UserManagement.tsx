import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import InfoCard from "@/components/admin/InfoCard";
import Pagination from "@/components/common/Pagination";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { useEffect, useMemo, useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { adminSideBarOptions, customersData } from "@/utils/constant";
import type { CustromersData } from "@/shared/Types/user";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import { useDebounce } from "use-debounce";
import { RoleEnum } from "@/shared/enums/roles";

const UserManagement: React.FC = () => {
  const [custData, setCustData] = useState<CustromersData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery,300)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getUsersByRoleApi(RoleEnum.CUSTOMER);
        if (res.status === 200) setCustData(customersData||res.data.customersData);
        if (res.status === 204) toast.info(res.data.message);
      } catch {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {  //this is to reset to page 1 on  search or filter change
    setCurrentPage(1) 
  },[debouncedQuery, filter])

  const filteredCustomers = useMemo(()=>{ //implimented useMemo for optimization and debounce
    
    return custData.filter((user) => {  
      const matchSearch = user.fname?.toLowerCase().includes(debouncedQuery.toLowerCase())
      
      let  matchFilter = true;
      if (filter === "blocked") {   //isBlocked = true
        matchFilter = user.isBlocked;
      } else if (filter === "unblocked") {
        matchFilter = !user.isBlocked;
      }
      return matchSearch && matchFilter
    })
  },[debouncedQuery,filter,custData])
  
  const paginatiedCustomer = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCustomers.slice(start, start + itemsPerPage)
  },[filteredCustomers,currentPage])


  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={8} /> 
          </div>
        ): (
            <div className="flex-1 bg-footer-background text-body-text">
              <SearchFilterBar 
                filterOptions={[
                  { label: "Filter", value: "" },
                  { label: "Blocked", value: "blocked" },
                  { label: "Unblocked", value: "unblocked" },
                ]}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onFilter={setFilter}
              />
                
              <InfoCard
                datas={paginatiedCustomer}
                type="customer"
              />
                
              <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredCustomers.length / itemsPerPage)}
                  onPage={setCurrentPage}
              />
            </div>
        )}
      </div>  

    </>
  );
};

export default UserManagement;
