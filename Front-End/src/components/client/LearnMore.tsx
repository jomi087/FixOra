import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import type { MainCategory } from "@/shared/types/category";


//temp data
import { App_Name } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/helper/utils";
import { useAppSelector } from "@/store/hooks";
import { RoleEnum } from "@/shared/enums/Role";


interface learMoreProps {
  categories: MainCategory[]
  providers: {
    providerUserId: string;
    providerImage: string
  }[];
  isPending: Boolean
}


const LearnMore: React.FC<learMoreProps> = ({ categories, providers, isPending }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const handleServices = (section: string) => {
    if (!isAuthenticated) {
      navigate(`/signIn/${RoleEnum.CUSTOMER}`, { state: { from: `/customer/services#${slugify(section)}` } });
    } else {
      navigate(`/customer/services#${slugify(section)}`);
    }
  };
  const canLoopProviders = providers.length > 1;
  const canLoopServices = categories.length > 4;

  return (
    <section id="learnMore" className={"py-10"} aria-label={`Information about ${App_Name} services and providers`} >
      <div className="container mx-auto px-4">

        {/*  About */}
        <h3 className="text-center text-2xl font-medium pt-10 pb-5 italic underline">
          Fixing Made Simple - Service Made Reliable
        </h3>

        <p className="text-center text-sm sm:text-lg font-mono md:w-3/4 mx-auto">
          {`${App_Name} is your all-in-one solution for home repair services. Whether it's appliances, electrical issues, or plumbing needs – book trusted professionals in just a few taps. Fast, reliable, and hassle-free.`}
        </p>

        {/* Service Slider */}
        {(!user || user.role === RoleEnum.CUSTOMER) && (
          <div className="">
            <h3 className="text-xl font-medium text-center underline pt-10 pb-5" >
              SERVICES PROVIDED
            </h3>
            <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4 mx-auto pb-5" id="service_Provided">
              Complete home care, evolving with you. We are dedicated to providing seamless repair solutions while continuously adding new ways to keep your home running perfectly.            </p>
            {!isPending && categories.length != 0 &&
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                loop={canLoopServices}
                autoplay={
                  canLoopServices
                    ? { delay: 3000, disableOnInteraction: false }
                    : false
                }
                speed={5000} // Smooth transition duration in milliseconds
                breakpoints={{
                  340: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                  },
                  700: {
                    slidesPerView: categories.length < 4 ? categories.length : 4,
                    spaceBetween: 20,
                  },
                }}
                className="max-w-[90%] lg:max-w-[100%] "
                aria-label="Service options slider"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.categoryId} className="p-4 ">
                    <div className="w-[99%] rounded-2xl text-center cursor-pointer shadow-lg shadow-black border ">
                      <div className=" h-48 overflow-hidden p-1 rounded-t-2xl">
                        <img src={category.image} alt={category.name} className="w-full h-full object-contain rounded-t-2xl " loading="lazy" />
                      </div>
                      <h6 className="text-lg font-mono mb-2 mt-2">{category.name.toUpperCase()}</h6>
                      <p className="text-sm">{category.description}</p>
                      <button

                        className="border rounded-full px-2 py-1 mt-4 mb-8 shadow-md shadow-black text-right cursor-pointer"
                        onClick={() => { handleServices(category.name); }}
                      >
                        View More
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            }
          </div>
        )}


        {/* Certified Provider */}
        <div className="mt-10">
          <h3 className="text-xl font-medium text-center pb-5">Why Choose {App_Name}?</h3>
          <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4 mx-auto">
            {` ${App_Name} is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need`}
          </p>
          <div
            className={`grid mt-20 p-10 ${providers.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
          >
            {providers.length > 0 && (
              <div className="rounded-2xl text-center cursor-pointer shadow-2xl shadow-black w-full h-90 overflow-hidden">
                <Swiper
                  modules={[Pagination, Navigation, Autoplay]} // Add Pagination module
                  pagination={{ clickable: true }} // Enable clickable pagination
                  loop={canLoopProviders}
                  autoplay={
                    canLoopProviders
                      ? { delay: 3000, disableOnInteraction: false }
                      : false
                  }
                  aria-label="Certified service providers slider"
                >
                  {providers.map((provider) => (
                    <SwiperSlide key={provider.providerUserId}>
                      <img
                        src={provider.providerImage}
                        alt="provider1 image"
                        className="rounded-2xl w-full "
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium text-center mt-4">Certified Providers</h3>
              <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4  mx-auto m-10   ">
                {`${App_Name} is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need.`}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );

};

export default LearnMore;

