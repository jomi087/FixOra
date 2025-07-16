// import AuthService from "@/services/AuthService";
// import { useEffect } from "react"
// import { toast } from "react-toastify"

import Nav from "@/components/common/layout/Nav"
import FilterSelect from "@/components/common/Others/FilterSelect"
import Pagination from "@/components/common/Others/Pagination"
import SearchInput from "@/components/common/Others/SearchInput"
import SideBar from "@/components/common/Others/SideBar"
import { adminSideBarOptions } from "@/utils/constant"
import { useState } from "react"
import { useDebounce } from "use-debounce"

const ProviderApplicationPage = () => {
  const [ providerApplications  , setProviderApplications] = useState([]) //all type of kyc data like pending approved rejected
  const [totalApplications , setTotalApplications ] = useState(0);
  const [searchQuery, setSearchQuery] = useState("")
  const [ filter, setFilter] = useState("all")
  const [ debouncedQuery] = useDebounce(searchQuery,500)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16

  const totalPages = Math.ceil(totalApplications / itemsPerPage)


  const filterOptions= [
    { label: "Pending", value: "Pending" },  //default
    { label: "Rejected", value: "Rejected" },
    { label: "ALL", value: "ALL" },
  ]
  
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
              
          </div>

          { providerApplications.length === 0 ? (
              <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                No Provider Application found
              </div>
              
            ) : (
              <>
                
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
  )
}

export default ProviderApplicationPage