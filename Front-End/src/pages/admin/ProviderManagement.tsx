import InfoCard from "@/components/admin/InfoCard";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import Pagination from "@/components/common/Pagination";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import AuthService from "@/services/AuthService";
import { RoleEnum } from "@/shared/enums/roles";
import type { ProviderData } from "@/shared/Types/user";
import { adminSideBarOptions } from "@/utils/constant";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
// import {  ProvidersData } from "@/utils/constant";


const ProviderManagement: React.FC = () => {
  const [provData, setProvData] = useState<ProviderData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery,300)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getUsersByRoleApi(RoleEnum.PROVIDER);
        console.log(res.data.usersData)
        if (res.status === 200) {
          setProvData(res.data.usersData);
        }
      } catch {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders()
  }, []);

  useEffect(() => {  //this is to reset to page 1 on  search or filter change
    setCurrentPage(1) 
  }, [debouncedQuery, filter])
  
  const filteredProviders = useMemo(()=>{  //implimented useMemo for optimization and debounce
    
    return provData.filter((user) => {  
      const matchSearch = user.fname?.toLowerCase().includes(debouncedQuery.toLowerCase())
      
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

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        {isLoading ? (
          <div className="flex-1 bg-footer-background text-body-text">
            <SkeletonInfoCard count={8} />
          </div>
          ) : provData.length === 0 ? ( 
              <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                No providers found.
              </div>
          ) : (
            <div className="flex-1  bg-footer-background text-body-text">
              <SearchFilterBar
                filterOptions={[
                  { label: "Filter", value: "" },
                  { label: "Blocked", value: "blocked" },
                  { label: "Unblocked", value: "unblocked" },
                  { label: "Online", value: "online" },
                  { label: "Offline", value: "offline" },
                ]}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onFilter={setFilter}
              />

              <InfoCard
                datas={paginatiedProvider}
                type="provider"
              />

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProviders.length / itemsPerPage)}
                onPage={setCurrentPage}
              />
            </div>
            ) 
        }
      </div>
    </>
  );
};

export default ProviderManagement