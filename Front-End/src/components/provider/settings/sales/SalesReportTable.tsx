import type { CompleteHistory } from "@/shared/types/salesReport";
import { shortBookingId } from "@/utils/helper/utils";

interface SalesReportTableProps {
  data: CompleteHistory[];
  loading: boolean;
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({ data, loading }) => {
  return (
    <div className="rounded-lg shadow bg-white w-full text-black">
      {/* Mobile View */}
      <div className="flex flex-col gap-3 w-full md:hidden">
        { loading ? (
          <div className="text-center text-gray-600 py-4 animate-pulse font-roboto">loading...</div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <div key={item.bookingId} className="border rounded-lg p-4 shadow w-full">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="font-medium text-gray-600">{key}</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-4">No Order Found</div>
        )}
      </div>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full table-auto divide-y divide-gray-200 bg-white">
          <thead style={{ background: "linear-gradient(135deg,#d4af37,#82C3C7)" }}>
            <tr className="text-left">
              {Object.keys(data[0] ?? ({} as CompleteHistory)).map((key) => (
                <th key={key} className="px-4 py-2 text-center">{key.toUpperCase()}</th>
              ))}
              <th className="px-4 py-2 text-center">Total</th>

            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="text-center text-gray-600 py-4 animate-pulse font-mono text-lg font-semibold ">loading...</div>
            ) :
              data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.bookingId}>
                    <td className="px-4 py-2 text-center">{shortBookingId(item.bookingId)}</td>
                    <td className="px-4 py-2 text-center">₹{item.serviceCharge}</td>
                    <td className="px-4 py-2 text-center">₹{item.distanceFee}</td>
                    <td className="px-4 py-2 text-center">₹-{item.commission}</td>
                    <td className="px-4 py-2 text-center">{new Date(item.Date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">₹{(item.serviceCharge + item.distanceFee) - item.commission}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(data[0] ?? {}).length || 1} className="px-4 py-6 text-center text-gray-600">
                    No Order Found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SalesReportTable;
