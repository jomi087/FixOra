import { useEffect, useState } from "react"
import BlogsPreview from "../../components/client/BlogsPreview"
import Hero from "../../components/client/Hero"
import LearnMore from "../../components/client/LearnMore"
import Footer from "../../components/common/layout/Footer"
import Nav from "../../components/common/layout/Nav"
import AuthService from "@/services/AuthService"
import { toast } from "react-toastify"
import type { MainCategory } from "@/shared/Types/category"
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode"
import { Messages } from "@/utils/constant"
// import type { ProviderImage } from "@/shared/Types/providers"


const LandingPage: React.FC = () => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  //const [providers, setProviders] = useState<ProviderImage[]>([]);
  
  const [loading, setLoading] = useState(true)  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AuthService.getLandingDataApi()
        if (res.status === HttpStatusCode.OK) {
          setCategories(res.data?.landingData?.categories)
          // setProviders(res.data?.providers)
        }
      } catch (error: any) {
        // console.log(error)
        const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
        toast.error(errorMsg);
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  },[])
  
  return (
    <div >
      <Nav className='bg-nav-background text-nav-text' />
      <main className="pt-16 bg-body-background text-body-text ">
        <Hero />
        <LearnMore
          categories = {categories}
          //providers = {providers}
          isPending = {loading}
        />
        <BlogsPreview/> 
      </main>
      <Footer className='bg-footer-background text-footer-text' />
    </div>
  )
}

export default LandingPage


