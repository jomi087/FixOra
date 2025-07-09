import { useEffect, useState, useTransition } from "react"
import BlogsPreview from "../../components/client/BlogsPreview"
import Hero from "../../components/client/Hero"
import LearnMore from "../../components/client/LearnMore"
import Footer from "../../components/common/layout/Footer"
import Nav from "../../components/common/layout/Nav"
import AuthService from "@/services/AuthService"
import { toast } from "react-toastify"
import type { MainCategory } from "@/shared/Types/category"
// import type { ProviderImage } from "@/shared/Types/providers"


const LandingPage: React.FC = () => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  //const [providers, setProviders] = useState<ProviderImage[]>([]);
  
  // const [loading, setLoading] = useState(false)  // replaces loading state with useTransition hook reacts new hook  which dies the same wrk but withless code
  const [ isPending, startTransition ] = useTransition();

  useEffect(() => {
    const fetchData = () => {
      startTransition( async () => {
        try {
          const res = await AuthService.getLandingData()
          if (res.status === 200) {
            setCategories(res.data?.landingData?.categories)
            // setProviders(res.data?.providers)

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
    <div >
      <Nav className='bg-nav-background text-nav-text' />
      <div className="pt-16 bg-body-background text-body-text ">
        <Hero />
        <LearnMore
          categories = {categories}
          //providers = {providers}
          isPending = {isPending}
        />
        <BlogsPreview/> 
      </div>
      <Footer className='bg-footer-background text-footer-text' />
    </div>
  )
}

export default LandingPage


