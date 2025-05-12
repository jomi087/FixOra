import { HeroSectionImage } from "../../utils/constant";

const Hero = () => {
  return (
    <section className="bg-hero-background text-white p-30 md:p-0">
      <div className="container mx-auto px-5 md:px-3 lg:px-20 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Welcome to FixOra
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Your one-stop solution for connecting with trusted service providers. 
            Experience seamless and reliable services tailored to your needs.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#services"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="bg-transparent border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </a>
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