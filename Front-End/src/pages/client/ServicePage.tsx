import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard"
import Services from "@/components/client/Services";
import Footer from "@/components/common/layout/Footer";
import Nav from "@/components/common/layout/Nav"
import AuthService from "@/services/AuthService";
import type { Category } from "@/shared/Types/category";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

const ServicePage : React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [ isPending, startTransition ] = useTransition();
    
    useEffect(() => {
        const fetchData = () => {
            startTransition( async () => {
                try {
                    const res = await AuthService.getActiveServices()
                    if (res.status === 200) {
                        setCategories(res.data?.servicesData)
                    }
                } catch (error: any) {
                    console.log(error)
                    const errorMsg = error?.response?.data?.message || "Failed to update status";
                    toast.error(errorMsg);
                }
            })
        }
        fetchData();
    },[])


    return (
    <>
        <Nav className="bg-nav-background text-nav-text" />
        <main className="pt-16 min-h-screen text-nav-text bg-nav-background ">
            <div className="py-10">
                <h2 className="text-3xl font-serif text-center">Our Services</h2>
                <h4 className="text-lg font-serif text-center pt-2 ">Discover the path to a just solution.</h4>
                <p className="text-sm font-serif text-center ">We offer a range of services and repairs for your needs as per our standards & quality to fix your issue happens</p>
            </div> 
            {isPending ? (
                <div className="flex-1 bg-footer-background text-body-text lg:px-20">
                    <SkeletonInfoCard count={8} style="pt-15" /> 
                </div>
                ) : (
                <div className="flex-1  bg-footer-background text-body-text mt-5 ">    
                    { categories.length === 0 ? (
                        <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                            No Services Added Yet!
                        </div>
                    ) : (
                        <Services categories={categories} />
                    )}
                </div>
                )
            }
        </main>
        <Footer className='bg-footer-background text-footer-text' />
            
    </>
  )
}
 
export default ServicePage