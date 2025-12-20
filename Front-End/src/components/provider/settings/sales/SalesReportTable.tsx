import type { CompleteHistory } from "@/shared/types/salesReport";
import { shortBookingId } from "@/utils/helper/utils";

interface SalesReportTableProps {
  data: CompleteHistory[];
  loading: boolean;
}

const columns = ["bookingId", "serviceCharge", "distanceFee", "commission", "Date", "Total"];

const SalesReportTable: React.FC<SalesReportTableProps> = ({ data, loading }) => {
  return (
    <div className="rounded-lg shadow bg-white w-full text-black">
      {/* Mobile View */}
      <div className="flex flex-col gap-3 w-full md:hidden">
        {loading ? (
          <div className="text-center text-gray-600 py-4 animate-pulse font-roboto">loading...</div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <div key={item.bookingId} className="border rounded-lg p-4 shadow w-full">
              <div className="">
                <p className="text-gray-800 text-xs font-semibold underline underline-offset-6 text-center">{new Date(item.Date).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">BookingId</span>
                <span className="text-gray-800">{shortBookingId(item.bookingId)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">ServiceCharge</span>
                <span className="text-gray-800">₹{item.serviceCharge}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">DistanceFee</span>
                <span className="text-gray-800">₹{item.distanceFee}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">Commission</span>
                <span className="text-gray-800">-₹{item.commission}</span>
              </div>

              <div className="flex justify-between py-1 border-t-2">
                <span className="font-medium text-gray-600">Total</span>
                <span className="text-gray-800">₹{(item.serviceCharge + item.distanceFee) - item.commission}</span>
              </div>
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
              {columns.map((key) => (
                <th key={key} className="px-4 py-2 text-center">{key.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-600 animate-pulse font-mono text-lg font-semibold ">
                  loading...
                </td>
              </tr>
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
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-600">
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
