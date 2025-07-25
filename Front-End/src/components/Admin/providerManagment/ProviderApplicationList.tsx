import ProviderListTable from "@/components/admin/providerManagment/ProviderListTable"
import FilterSelect from "@/components/common/Others/FilterSelect"
import Pagination from "@/components/common/Others/Pagination"
import SearchInput from "@/components/common/Others/SearchInput"
import AuthService from "@/services/AuthService"
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode"
import type { ProviderList } from "@/shared/Types/user"
import { Messages, PALPP } from "@/utils/constant"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDebounce } from "use-debounce"

const ProviderApplicationList:React.FC = () => {

    const [searchQuery, setSearchQuery] = useState("")
    const [ filter, setFilter] = useState("Pending")
    const [debouncedQuery] = useDebounce(searchQuery, 300)
    const [ providerApplications, setProviderApplications] = useState<ProviderList[]>([]) //all type of kyc data like pending approved rejected
    const [totalApplications , setTotalApplications ] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = PALPP || 15
    const [loading, setLoading] = useState(false);

    const totalPages = Math.ceil(totalApplications / itemsPerPage)

    const filterOptions= [
        { label: "Pending", value: "Pending" },  
        { label: "Rejected", value: "Rejected" },
        { label: "Approved", value: "Approved" },
    ]


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await AuthService.getProviderApplicationList(
                    debouncedQuery,
                    filter,
                    currentPage,
                    itemsPerPage
                );
                if (res.status === HttpStatusCode.OK) {
                    setProviderApplications(res.data.ApplicationData);
                    setTotalApplications(res.data.total);
                }
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [debouncedQuery, filter, currentPage]);

  
    return (
        <>
            { loading ? (
                <div className="flex flex-1 justify-center items-center h-[84vh] text-2xl font-mono font-semibold">
                    Loading...
                </div>
            ):(
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
                            <ProviderListTable data={providerApplications} setData={setProviderApplications} />  
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
            )}
        </>
    )
}

export default ProviderApplicationList