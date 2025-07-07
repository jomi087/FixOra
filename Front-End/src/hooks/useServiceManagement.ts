import AuthService from "@/services/AuthService";
import type { Category } from "@/shared/Types/category";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

export const useServiceManagement = (refreshFlag:Boolean) => {

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [totalCateogories, setTotalCateogories] = useState(0);
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState("all")
    const [debouncedQuery] = useDebounce(searchQuery,500)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    const totalPages = Math.ceil(totalCateogories / itemsPerPage);
    

      
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const res = await AuthService.getCategoryApi(debouncedQuery, filter, currentPage, itemsPerPage)
                if (res.status === 200) {
                    console.log("serviceMnagement", res.data)
                    setCategories(res.data.catogoriesData)
                    setTotalCateogories(res.data.total);

                }
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || "Failed to fetch Category";
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
    }
}