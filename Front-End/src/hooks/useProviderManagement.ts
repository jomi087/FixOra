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

    useEffect(() => { // this loggic is use to bring the page to  1 (sceanrio => Imagine you are on page 3, then you type a new search.If you don’t reset to page 1, the UI will still try to fetch page 3 of the new search results → which might be empty.)
    if (currentPage !== 1) { // this was  to avoid unnessesry rerend on page 1
        setCurrentPage(1);
    }
    }, [debouncedQuery, filter]);
  
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
        itemsPerPage,
        setProvData
    }
}