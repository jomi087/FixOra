
const BookingDetailsShimmer = () => {
  return (
    <div className="min-h-screen w-full sm:px-2 overflow-auto text-body-text">
      <div className="flex flex-col-reverse md:flex-row">
        {/* left */}
        <div className="w-full md:w-[60%] lg:w-[70%] p-5">
          {/* Section Heading */}
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />

          {/* Details */}
          <div className="space-y-4">
            <div className="h-4 w-56 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Payment Section */}
          <div className="mt-6 pt-4 border-t">
            <div className="h-6 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="flex justify-between font-medium">
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Buttons / Actions */}
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* right */}
        <div className="w-full md:w-[40%] lg:w-[30%] p-5 md:border-l-2">
          {/* Provider Info placeholder */}
          <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsShimmer;