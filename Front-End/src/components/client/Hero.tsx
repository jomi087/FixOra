import { App_Name, HeroSectionImage } from "../../utils/constant";
import { Link } from "react-router-dom";



const Hero:React.FC = () => {
  return (
    <section className="bg-hero-background text-white pt-50 pb-75 md:pb-0 md:pt-0 " role="banner" aria-label="Hero section with introduction and action buttons">
      <div className="container mx-auto px-5 md:px-3 lg:px-20 flex flex-col md:flex-row items-center ">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Welcome to {App_Name}
          </h1>
          <p className="md:text-xl mb-6">
            Your one-stop solution for connecting with trusted service providers. 
            Experience seamless and reliable services tailored to your needs.
          </p>
          <div className="md:text-md flex justify-center md:justify-start gap-4">
            <Link
              to="/services"
              className=" bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition "
              role="button"
              aria-label={`Get started with ${App_Name} services`}
            >
              Get Started
            </Link>
            <Link
              to="/"
              role='button'
              aria-label={`Learn more about ${App_Name} and how it works`}
              className="bg-transparent border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="hidden md:flex md:mt-0 md:ml-32">
          <img
            src= {HeroSectionImage}
            alt="Hero Illustration"
            className=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;