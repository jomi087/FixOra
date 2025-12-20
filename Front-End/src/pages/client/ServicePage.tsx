import SkeletonInfoCard from "@/components/admin/SkeletonInfoCard";
import ProviderTandC from "@/components/client/providersSection/providerApplication/ProviderTandC";
import Services from "@/components/client/servicesSection/Services";
import Footer from "@/components/common/layout/Footer";
import Nav from "@/components/common/layout/Nav";
import { Button } from "@/components/ui/button";
import useFetchCategories from "@/hooks/useFetchCategories";
import { useState } from "react";

const ServicePage: React.FC = () => {
  // const dispatch = useAppDispatch()
  // const {categories,loading } = useAppSelector((state) => state.category)

  // useEffect(() => {
  //     if (categories.length === 0) {
  //         dispatch(fetchCategories());
  //     }
  // }, [dispatch, categories.length])

  const { categories, loading } = useFetchCategories();
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />

      <main className="pt-18 min-h-screen text-nav-text bg-nav-background ">

        <div className="flex items-start justify-center relative mt-8">
          {/* Right-aligned button */}
          <Button
            variant="default"
            className="bg-yellow-600 cursor-pointer absolute right-4 -top-5"
            onClick={() => setOpenConfirm(true)}
          >
            Become Providers
          </Button>

          {/* Center titles */}
          <div className="text-center">
            <h2 className="text-3xl font-serif">Our Services</h2>
            <h4 className="text-lg font-serif pt-2">
              Discover the path to a just solution.
            </h4>
            <p className="text-sm font-serif">
              We offer a range of services and repairs for your needs as per our
              standards & quality to fix your issue happens.
            </p>
          </div>

        </div>

        {loading ? (
          <div className="flex-1 bg-footer-background text-body-text lg:px-20">
            <SkeletonInfoCard count={8} style="pt-15" />
          </div>
        ) : (
          <div className="flex-1  bg-footer-background text-body-text mt-5 ">
            {categories.length === 0 ? (
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

      {/* T & C */}
      <ProviderTandC openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
    </>
  );
};

export default ServicePage;