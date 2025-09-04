import React from "react";

const BookingInfoShimmer: React.FC = () => {
  const shimmerDates = Array.from({ length: 7 });
  const shimmerSlots = Array.from({ length: 12 });

  return (
    <div className="border-1 border-primary/50 text-body-text overflow-x-auto w-screen mx-2 my-5 rounded-md shadow-2xl animate-pulse" >
      < div className="text-center py-4 bg-gradient-background" >
        <div className="mx-auto h-5 w-40 bg-gray-300 rounded" > </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-[minmax(60px,_auto)_repeat(7,1fr)] border-t" >
        {/* D&T column */}
        < div className="border-b border-r p-1 text-center font-serif" >
          <div className="h-4 w-8 bg-gray-300 rounded mx-auto" > </div>
        </div>

        {/* Dates shimmer */}
        {
          shimmerDates.map((_, i) => (
            <div
              key={i}
              className="border-b border-r p-1 flex items-center justify-center"
            >
              <div className="h-4 w-8 bg-gray-300 rounded" > </div>
            </div>
          ))
        }

        {/* Time slots shimmer */}
        {
          shimmerSlots.map((_, i) => (
            <React.Fragment key={i} >
              {/* Time column */}
              < div className="border rounded-md p-2 text-center" >
                <div className="h-4 w-12 bg-gray-300 rounded mx-auto" > </div>
              </div>

              {/* Booking slots for each date */}
              {
                shimmerDates.map((_, j) => (
                  <div
                    key={j}
                    className="h-10 border rounded-md flex items-center justify-center"
                  >
                    <div className="h-4 w-10 bg-gray-300 rounded" > </div>
                  </div>
                ))
              }
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default BookingInfoShimmer;
