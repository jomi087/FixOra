import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination ,Navigation ,Autoplay} from 'swiper/modules';

//temp data
import { services , providers } from '../../utils/constant';


const LearnMore = () => {
  return (
    <section id="learnMore" className={'py-10'}>
      <div className="container mx-auto px-4">

        {/*  About */}
        <h3 className="text-center text-2xl font-medium pt-10 pb-5 italic underline">
          Fixing Made Simple - Service Made Reliable
        </h3>

        <p className="text-center font-mono w-3/4 mx-auto">
          FixOra is your all-in-one solution for home repair services. Whether it's appliances, electrical issues, or plumbing needs – book trusted professionals in just a few taps. Fast, reliable, and hassle-free.
        </p>
  
        {/* Service Slider */}
        <div className="">                
          <h3 className="text-xl font-medium text-center underline pt-10 pb-5">
            SERVICES PROVIDED
          </h3>
          <p className="text-center font-mono font-medium w-3/4 mx-auto pb-5">
            We currently offer a wide range of home repair services, including appliance servicing, electrical fixes, and plumbing solutions. Our platform is constantly evolving — new and specialized services will be added regularly to meet your needs more effectively.
          </p>
          <Swiper
             modules={[Pagination, Navigation, Autoplay]} // Add Pagination module
            pagination={{ clickable: true }} // Enable clickable pagination
            loop= { true }
            autoplay={{
              delay: 1,
              disableOnInteraction : false,
            }}
            speed={5000} // Smooth transition duration in milliseconds
            breakpoints={{
              340: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              700: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="max-w-[90%] lg:max-w-[100%] h-[80vh]   "
          >
            
            {services.map((service) => (
              <SwiperSlide key={service.title} className="p-4 ">
                <div className="w-[99%] rounded-2xl text-center cursor-pointer shadow-lg shadow-black border ">
                  <div className=" h-48 overflow-hidden p-1 rounded-t-2xl">
                      <img src={service.image} alt={service.title} className="rounded-t-2xl " />
                  </div>
                  <h6 className="text-lg font-bold mb-2 mt-2">{service.title}</h6>
                  <p className="text-sm">{service.description}</p>
                  <button className="border rounded-full px-2 py-1 mt-4 mb-8 shadow-md shadow-black text-right cursor-pointer">
                    View More
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Certified Provider */}
        <div className="mt-10">
          <h3 className="text-xl font-medium text-center pb-5">Why Choose FixOra?</h3>
          <p className="text-center font-mono font-medium w-3/4 mx-auto">
            FixOra is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need.
          </p>
          <div className ='grid grid-cols-1 md:grid-cols-2 mt-20   to-blue-500 from-amber-500  p-10'>
            <div className=''>
                <div className="rounded-2xl text-center cursor-pointer shadow-2xl shadow-black">
                <Swiper
                   modules={[Pagination, Navigation, Autoplay]} // Add Pagination module
                  pagination={{ clickable: true }} // Enable clickable pagination
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction : false,
                  }}
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
              <p className="text-center font-mono font-medium w-3/4 mx-auto m-10">
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

