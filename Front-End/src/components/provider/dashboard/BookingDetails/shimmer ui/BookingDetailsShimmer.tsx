
const BookingDetailsShimmer = () => {
  return (
    <div className="min-h-screen p-0 sm:p-5 overflow-auto text-body-text">
      <div className="flex flex-col-reverse md:flex-row">
        {/* Left */}
        <div className="w-full md:w-[60%] lg:w-[70%] p-5 space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-gray-300 rounded" />
          <div className="h-4 w-48 bg-gray-300 rounded" />
          <div className="h-4 w-40 bg-gray-300 rounded" />
          <div className="h-24 w-full bg-gray-300 rounded" />

          <div className="mt-4 space-y-2">
            <div className="h-5 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-[40%] lg:w-[30%] p-5 space-y-4 md:border-l-2 animate-pulse">
          <div className="h-6 w-48 mx-auto bg-gray-300 rounded" />
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-300" />

          <div className="h-4 w-28 mx-auto bg-gray-300 rounded" />

          <div className="space-y-2 border-t pt-4">
            <div className="h-4 w-36 bg-gray-300 rounded" />
            <div className="h-4 w-48 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Images */}
      <div className="flex mt-5 gap-3 overflow-x-auto animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-40 h-40 rounded bg-gray-300" />
        ))}
      </div>
    </div>
  );
};

export default BookingDetailsShimmer;