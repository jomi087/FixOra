import { fetchCategories } from "@/store/user/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";


const useFetchCategories   = () => {
    const dispatch = useAppDispatch()
    const { categories, loading } = useAppSelector((state) => state.category)

    useEffect(() => { //for handling refersh scenario
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }

    }, [dispatch, categories.length])

    return { categories , loading }
}

export default useFetchCategories
