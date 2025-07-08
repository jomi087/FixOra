import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { MainCategory } from '@/shared/Types/category';
// import type { ProviderImage } from '@/shared/Types/providers';


//temp data
import { providers } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
 

interface learMoreProps{
  categories: MainCategory[]
  //providers:ProviderImage[]
  isPending: Boolean
}


const LearnMore: React.FC<learMoreProps> = ({ categories, isPending }) => {
  const navigate = useNavigate()
  return (
    <section id="learnMore" className={'py-10'} aria-label="Information about FixOra services and providers" >
      <div className="container mx-auto px-4">

        {/*  About */}
        <h3 className="text-center text-2xl font-medium pt-10 pb-5 italic underline">
          Fixing Made Simple - Service Made Reliable
        </h3>

        <p className="text-center text-sm sm:text-lg font-mono md:w-3/4 mx-auto">
          FixOra is your all-in-one solution for home repair services. Whether it's appliances, electrical issues, or plumbing needs – book trusted professionals in just a few taps. Fast, reliable, and hassle-free.
        </p>
  
        {/* Service Slider */}
        <div className="">
          <h3 className="text-xl font-medium text-center underline pt-10 pb-5">
            SERVICES PROVIDED
          </h3>
          <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4 mx-auto pb-5">
            We currently offer a wide range of home repair services, including appliance servicing, electrical fixes, and plumbing solutions. Our platform is constantly evolving — new and specialized services will be added regularly to meet your needs more effectively.
          </p>
          { !isPending && categories.length != 0 &&
            <Swiper
              modules={[Pagination, Navigation, Autoplay]} 
              loop= { true }
              autoplay={{
                delay: 3000,
                disableOnInteraction : false,
              }}
              speed={5000} // Smooth transition duration in milliseconds
              breakpoints={{
                340: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                },
                700: {
                  slidesPerView: categories.length < 4 ? categories.length : 4 ,
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
                      <img src={category.image} alt={category.name} className="w-full h-full object-contain rounded-t-2xl "  loading="lazy"/>
                    </div>
                    <h6 className="text-lg font-bold mb-2 mt-2">{category.name}</h6>
                    <p className="text-sm">{category.description}</p>
                    <button
                      className="border rounded-full px-2 py-1 mt-4 mb-8 shadow-md shadow-black text-right cursor-pointer"
                      onClick={()=>{ navigate('/user/services') }}
                    >
                      View More
                    </button>
                  </div>
                </SwiperSlide>
              )) } 
            </Swiper>  
          }
        </div>

        {/* Certified Provider */}
        <div className="mt-10">
          <h3 className="text-xl font-medium text-center pb-5">Why Choose FixOra?</h3>
          <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4 mx-auto">
            FixOra is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need.
          </p>
          <div className ='grid grid-cols-1 md:grid-cols-2 mt-20   to-blue-500 from-amber-500  p-10'>
            <div className=''>
                <div className="rounded-2xl text-center cursor-pointer shadow-2xl shadow-black">
                <Swiper
                  modules={ [Pagination, Navigation, Autoplay] } // Add Pagination module
                  pagination={{ clickable: true }} // Enable clickable pagination
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction : false,
                  }}
                  aria-label="Certified service providers slider"
                >
                  {providers.map((provider,index) => (
                    <SwiperSlide key={index}>
                      <div className="overflow-hidden rounded-t-2xl">
                        <img src={provider} alt="provider1 image" className="rounded-2xl h-[100%]" />
                      </div>
                    </SwiperSlide>
                  ))}
                 </Swiper>
                </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-center mt-4">Certified Providers</h3>
              <p className="text-center text-sm sm:text-lg font-mono font-medium md:w-3/4  mx-auto m-10   ">
                FixOra is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );

};

export default LearnMore;

