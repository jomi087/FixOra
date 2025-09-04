import { Card, CardContent } from "@/components/ui/card";

const BookingHistoryShimmer = () => {
  const placeholderRows = Array.from({ length: 5 });

  return (
    <Card className="w-screen mx-2 my-5 border-1 border-primary/50 shadow-2xl animate-pulse">
      <CardContent className="py-4 bg-gradient-background rounded-t-md">
        <div className="bg-gray-300 h-6 w-32 rounded" />
      </CardContent>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr>
              {["S.No", "Booking-ID", "Date", "Time", "Progress"].map((h) => (
                <th key={h} className="p-2 border-b border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {placeholderRows.map((_, idx) => (
              <tr key={idx}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <td key={i} className="p-2">
                      <div className="bg-gray-300 h-4 w-full rounded" />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CardContent className="flex justify-center py-4">
        <div className="bg-gray-300 h-8 w-40 rounded" />
      </CardContent>
    </Card>
  );
};

export default BookingHistoryShimmer;
