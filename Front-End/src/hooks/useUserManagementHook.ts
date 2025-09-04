import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { CustomersData  } from "@/shared/Types/user";
import { CCPP, Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

export const useUserManagement = ()=>{
  const [custData, setCustData] = useState<CustomersData []>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [debouncedQuery] = useDebounce(searchQuery,500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = CCPP || 16;
  
  const totalPages = useMemo(() =>
    Math.ceil(totalCustomers / itemsPerPage)
  ,[totalCustomers, itemsPerPage]);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getCustomerApi(debouncedQuery,filter,currentPage,itemsPerPage);
        if (res.status === HttpStatusCode.OK) {
          setCustData(res.data.customersData);
          setTotalCustomers(res.data.total); 
        }
      } catch(error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [debouncedQuery,filter,currentPage]);

  useEffect(() => {  //this is to reset to page 1 on  search or filter change
    setCurrentPage(1); 
  }, [debouncedQuery, filter]);
    
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
  };
};