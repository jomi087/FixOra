

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages, PCPP } from "@/utils/constant";
import type { ActiveProvider } from "@/shared/Types/user";
import { setApplyFilters, setReset } from "@/store/user/filterSlice";

export const useAuthProvider = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {selectedService,nearByFilter,ratingFilter,availabilityFilter,applyFilter,reset } = useAppSelector((state)=>state.filter)    

    const [data, setData] = useState<ActiveProvider[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = PCPP || 12

    const [debouncedQuery] = useDebounce(searchQuery, 500);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await AuthService.getAuthProvidersApi({
                    searchQuery: debouncedQuery,
                    filter,
                    currentPage,
                    itemsPerPage,
                    selectedService,
                    nearByFilter,
                    ratingFilter,
                    availabilityFilter,
                });

                if (res.status === HttpStatusCode.OK) {
                    setData(res.data.providerData ?? []);
                    setTotal(res.data.total ?? 0);
                }  
                if (applyFilter) dispatch(setApplyFilters(false));
                if (reset) dispatch(setReset(false));

            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA ;
                toast.error(errorMsg)
                if (error.response.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    navigate('/user/account/profile')
                };
            } finally {
                setLoading(false);
            }
        };
         fetchData()
            
    }, [debouncedQuery, filter, currentPage, applyFilter,reset]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery, filter, applyFilter,reset]);

    const totalPages = useMemo(
        () => Math.ceil(total / itemsPerPage),
        [total, itemsPerPage ]
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
    };
    
};




