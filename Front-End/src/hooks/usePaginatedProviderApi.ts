import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";

// API response type
interface PaginatedApiResponse<T> {
  status: number;
  data: {
    providerData: T[];
    total: number;
  };
}

// API function type (accepts query/filter/pagination)
type PaginatedApiFn<T> = (
  query: string,
  filter: string,
  page: number,
  perPage: number,
  extrafilters? : Record<string, any> //Record<KeyType, ValueType>
) => Promise<PaginatedApiResponse<T>>;

// Hook Options
interface PaginatedHookOptions {
  defaultFilter: string;
  defaultItemsPerPage: number;
  debounceDelay: number;
}

// generic hook
//For an easy way i de-strcuture the code  ( Hard coded way show  at the last )
export const usePaginatedProviderApi = <T>( apiFn: PaginatedApiFn<T>,{ defaultFilter = "all",defaultItemsPerPage = 12,debounceDelay = 500,}: PaginatedHookOptions  ) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(defaultFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery] = useDebounce(searchQuery, debounceDelay);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await apiFn(
                    debouncedQuery,
                    filter,
                    currentPage,
                    defaultItemsPerPage
                );

                if (res.status === HttpStatusCode.OK) {
                    setData(res.data.providerData ?? []);
                    setTotal(res.data.total ?? 0);
                } 
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch providers");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [debouncedQuery, filter, currentPage]);

    useEffect(() => {
        if (currentPage !== 1) setCurrentPage(1);
    }, [debouncedQuery, filter]);

    const totalPages = useMemo(
        () => Math.ceil(total / defaultItemsPerPage),
        [total, defaultItemsPerPage]
    );

  return {
    data,
    isLoading,
    total,
    totalPages,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage: defaultItemsPerPage,
    setData,
  };
};

/*
export const usePaginatedProviderApi = <T>(apiFn: PaginatedApiFn<T>, options?: PaginatedHookOptions) => {
  const defaultFilter = options?.defaultFilter ?? "all";
  const defaultItemsPerPage = options?.defaultItemsPerPage ?? 16;
  const debounceDelay = options?.debounceDelay ?? 500;

  rest of the logic

*/