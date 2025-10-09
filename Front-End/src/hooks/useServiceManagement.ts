import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { Category } from "@/shared/types/category";
import { Messages, SLPP } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

export const useServiceManagement = (refreshFlag:Boolean) => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCateogories, setTotalCateogories] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [debouncedQuery] = useDebounce(searchQuery,500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = SLPP || 10;

  const totalPages = Math.ceil(totalCateogories / itemsPerPage);
    

      
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getCategoryApi(debouncedQuery, filter, currentPage, itemsPerPage);
        if (res.status === HttpStatusCode.OK) {
          setCategories(res.data.catogoriesData);
          setTotalCateogories(res.data.total);

        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_CATEGORY ;
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [debouncedQuery, filter, currentPage, refreshFlag]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, filter]);
    
  return {
    categories,
    loading,
    setSearchQuery,
    setFilter,
    totalPages,
    searchQuery,
    filter,
    currentPage,
    setCurrentPage,
    setCategories
  };
};