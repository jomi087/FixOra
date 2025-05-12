import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';

//temp data
import { services } from '../../utils/constant';

const LearnMore = () => {
  return (
    <section id="learnMore" className="bg-body-background text-body-text py-10">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h3 className="text-center text-2xl font-medium pt-10 pb-5 italic underline">
          Fixing Made Simple - Service Made Reliable
        </h3>

        {/* Intro Paragraph */}
        <p className="text-center font-mono w-3/4 mx-auto">
          FixOra is your all-in-one solution for home repair services. Whether it's appliances, electrical issues, or plumbing needs – book trusted professionals in just a few taps. Fast, reliable, and hassle-free.
        </p>
        <p className="text-center font-mono font-bold mt-4 w-3/4 mx-auto">
          One Stop Solution for Home Repairs – Quick Booking, Trusted Experts.
        </p>

        {/* Services Provided Section */}
        <h3 className="text-xl font-medium text-center pt-10 pb-5">
          SERVICES PROVIDED
        </h3>

        {/* Active Slider */}
        <div className="">
        <Swiper
  breakpoints={{
    340: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    700: {
      slidesPerView: 4,
      spaceBetween: 6,
    },
  }}
  freeMode={true}
  pagination={{
    clickable: true,
  }}
  modules={[FreeMode, Pagination]}
  className="max-w-[90%] lg:w-[95%] " // Add padding at the bottom
>
  {services.map((service) => (
    <SwiperSlide key={service.title}>
      <div className="w-[90%] border rounded-2xl text-center cursor-pointer shadow-lg">
        <img
          src={service.image}
          alt={service.title}
          className="object-cover rounded-t-2xl mb-4"
        />
        <h6 className="text-lg font-bold mb-2">{service.title}</h6>
        <p className="text-sm">{service.description}</p>
        <button className="border rounded-full px-2 py-1 mt-4 mb-8 shadow-lg text-right cursor-pointer">
          View More
        </button>
      </div>
    </SwiperSlide>
  ))}
</Swiper>
        </div>

        {/* Additional Information */}
        <div className="mt-10">
          <h3 className="text-xl font-medium text-center pb-5">Why Choose FixOra?</h3>
          <p className="text-center font-mono font-medium w-3/4 mx-auto">
            We currently offer a wide range of home repair services, including appliance servicing, electrical fixes, and plumbing solutions. Our platform is constantly evolving — new and specialized services will be added regularly to meet your needs more effectively.
            <br />
            <br />
            FixOra is not just a service hub for customers — it's also a growing network for professionals. Skilled technicians and service providers are welcome to join our platform, expand their reach, and collaborate with us to introduce new service categories. Together, we aim to create a comprehensive solution for every household need.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LearnMore;