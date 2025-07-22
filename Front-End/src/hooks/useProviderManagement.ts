import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ProviderData } from "@/shared/Types/user";
import { PCPP } from "@/utils/constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";


export const useProviderManagement = () => {
    const [provData, setProvData] = useState<ProviderData[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [totalProviders, setTotalProviders] = useState(0);
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState("all")
    const [debouncedQuery] = useDebounce(searchQuery,500)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = PCPP ||  16

    useEffect(() => {
        const fetchProviders = async () => {
        setLoading(true);
        try {
            const res = await AuthService.getProviderApi(debouncedQuery,filter,currentPage,itemsPerPage);
            if (res.status === HttpStatusCode.OK) {
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
  
    return {
        provData,
        isLoading,
        totalProviders,
        setSearchQuery,
        filter,
        setFilter,
        currentPage,
        searchQuery,
        setCurrentPage,
        itemsPerPage
    }
}