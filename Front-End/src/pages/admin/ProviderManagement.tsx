import InfoCard from "@/components/admin/InfoCard";
import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import Pagination from "@/components/common/Pagination";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import AuthService from "@/services/AuthService";
import type { ProviderData } from "@/shared/Types/user";
import { adminSideBarOptions } from "@/utils/constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
//import {  ProvidersData } from "@/utils/constant";
import { Button } from "@/components/ui/button";


const ProviderManagement: React.FC = () => {
  const [provData, setProvData] = useState<ProviderData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalProviders, setTotalProviders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [debouncedQuery] = useDebounce(searchQuery,500)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getProviderApi(debouncedQuery,filter,currentPage);
        if (res.status === 200) {
          setProvData(res.data.providerData);
          setTotalProviders(res.data.total)
        }
      } catch {
        toast.error("Failed to fetch Providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders()
  }, [debouncedQuery,filter,currentPage]);

  useEffect(() => {  
    setCurrentPage(1) 
  }, [debouncedQuery, filter])
  

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
            <div className="flex-1  bg-footer-background text-body-text">
                <SearchFilterBar
                  filterOptions={[
                    { label: "All", value: "all" },
                    { label: "Blocked", value: "blocked" },
                    { label: "Unblocked", value: "unblocked" },
                    { label: "Online", value: "online" },
                    { label: "Offline", value: "offline" },
                  ]}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onFilter={setFilter}
                  filter={filter}
                  rightSlot={<Button variant="default" className="bg-yellow-600">Verify Providers</Button>}

              />
              
              { provData.length === 0 ? (
                <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                  No providers found.
                </div>
                ) : (
                  <>
                    <InfoCard
                      datas={provData}
                      type="provider"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalProviders / itemsPerPage)}
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