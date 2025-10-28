import type { SalesReport } from "@/shared/types/salesReport";

interface SalesReportTableProps {
  data: SalesReport[];
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({ data }) => {
  return (
    <div className="rounded-lg shadow bg-white w-full text-black">
      {/* Mobile View */}
      <div className="flex flex-col gap-3 w-full md:hidden">
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow w-full">
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
              {Object.keys(data[0] ?? ({} as SalesReport)).map((key) => (
                <th key={key} className="px-4 py-2">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            { data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  {Object.values(item).map((value, i) => (
                    <td key={i} className="px-4 py-2">{value}</td>
                  ))}
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
