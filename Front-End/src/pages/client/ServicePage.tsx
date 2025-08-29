import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import Services from "@/components/client/servicesSection/Services";
import Footer from "@/components/common/layout/Footer";
import Nav from "@/components/common/layout/Nav";
import useFetchCategories from "@/hooks/useFetchCategories";

const ServicePage : React.FC = () => {
  // const dispatch = useAppDispatch()
  // const {categories,loading } = useAppSelector((state) => state.category)
    
  // useEffect(() => {
  //     if (categories.length === 0) {
  //         dispatch(fetchCategories());
  //     }
  // }, [dispatch, categories.length])

  const { categories,loading } = useFetchCategories();

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <main className="pt-16 min-h-screen text-nav-text bg-nav-background ">
        <div className="py-10">
          <h2 className="text-3xl font-serif text-center">Our Services</h2>
          <h4 className="text-lg font-serif text-center pt-2 ">Discover the path to a just solution.</h4>
          <p className="text-sm font-serif text-center ">We offer a range of services and repairs for your needs as per our standards & quality to fix your issue happens</p>
        </div> 
        {loading ? (
          <div className="flex-1 bg-footer-background text-body-text lg:px-20">
            <SkeletonInfoCard count={8} style="pt-15" /> 
          </div>
        ) :  (
          <div className="flex-1  bg-footer-background text-body-text mt-5 ">    
            { categories.length === 0 ? (
              <div className="flex justify-center items-center h-[84vh] w-full text-2xl font-semibold ">
                            No Services Added Yet!
              </div>
            ):(
              <Services categories={categories} />
            )}
          </div>
        )
        }
      </main>
      <Footer className='bg-footer-background text-footer-text' />
            
    </>
  );
};
 
export default ServicePage;