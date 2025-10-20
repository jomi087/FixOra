
const ServiceShimmer: React.FC<{ text?: string }> = ({ text = "loading..." }) => {
  return (
    <div className={`flex-1 w-full md:w-2/3 space-y-6 ${text === "loading..." ? "cursor-progress" : "" }`}>
      {/* Service Charge */}
      <div className="">
        <div className="space-y-1">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Service Charge
          </p>
          <p className="ml-4 text-primary font-mono opacity-50 ">{text}</p>
        </div>
      </div>

      {/* Services */}
      <div className="">
        <div className="w-full space-y-2"> {/* added flex-col */}
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Services
          </p>

          <div className="flex flex-wrap gap-2 ml-2 ">
            {text === "loading..." ? (
              <>
                <p>Loading :</p>
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm font-roboto border-2 rounded-lg cursor-progress text-primary  opacity-50 flex items-center gap-1"
                  >
                    {text}
                  </span>
                ))}
              </>
            ) : (
              <p className="ml-3 text-primary font-mono opacity-50 ">{text}</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceShimmer;