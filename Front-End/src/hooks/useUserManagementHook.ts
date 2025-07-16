import AuthService from "@/services/AuthService";
import type { CustomersData  } from "@/shared/Types/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

export const useUserManagement = ()=>{
  const [custData, setCustData] = useState<CustomersData []>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [debouncedQuery] = useDebounce(searchQuery,500)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getCustomerApi(debouncedQuery,filter,currentPage,itemsPerPage);
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
  }, [debouncedQuery, filter])
    
    return {
        custData,
        isLoading,
        totalPages,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setCustData,
    }
}