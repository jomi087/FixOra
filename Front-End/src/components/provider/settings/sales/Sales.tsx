import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthService from "@/services/AuthService";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Download } from "lucide-react";
import type { SalesPreset, SalesSummary } from "@/shared/types/salesReport";
import SalesReportTable from "./SalesReportTable";


const Sales = () => {
  const [activePreset, setActivePreset] = useState<SalesPreset>("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [salesReport, setSalesReport] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesReport(activePreset);
  }, [activePreset]);

  const fetchSalesReport = async (filter: SalesPreset | null = null, startDate: string | null = null, endDate: string | null = null) => {
    if (loading) {
      toast.success("wait dude");
      return;
    }
    setLoading(true);
    try {
      let res = await AuthService.salesReport(filter, startDate, endDate);
      setSalesReport(res.data.salesReport as SalesSummary);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg =
        err?.response?.data?.message ||
        Messages.FAILED_TO_FETCH_DATA;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (filter: SalesPreset) => {
    setActivePreset((prev) => prev == filter ? prev : filter);
  };

  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0] as string; // "YYYY-MM-DD"

    if (!startDate || !endDate) {
      setError("Select a date range");
      return;
    } else if (startDate > today || endDate > today) {
      setError("Dates cannot be in the future");
      return;
    } else if (startDate > endDate) {
      setError("Start date cannot be after end date");
      return;
    }
    fetchSalesReport(null, startDate, endDate);
  };

  return (
    <div className="w-full p-6">
      <div className="flex gap-2 justify-between">
        <h3 className="text-xl sm:text-2xl font-semibold font-mono mb-4 underline underline-offset-4">Report</h3>
        <div className="relative inline-block sm:hidden text-left  ">
          <div>
            <button
              type="button"
              className="inline-flex active:scale-95 mr-2"
              aria-expanded={showDownloadMenu}
              onClick={() => setShowDownloadMenu((prev) => !prev)}
            >
              <Download size={16} className="mt-1" />

            </button>
          </div>
          {showDownloadMenu && (
            <div className="origin-top-right border-2 absolute right-0 w-18 py-1 mt-1 rounded-sm  bg-white ">
              <button
                onClick={() => {
                  setShowDownloadMenu(false);
                  // downloadPDF();
                }}
                className="w-full text-start font-mono text-black border-b border-primary py-1 pl-1 text-sm font-semibold hover:bg-gray-100 hover:text-red-600"
              >
                🔻PDF
              </button>
              <button
                onClick={() => {
                  setShowDownloadMenu(false);
                  // downloadCSV();
                }} className="w-full text-start font-mono text-black border-primary py-1 pl-1 text-sm font-semibold hover:bg-gray-100 hover:text-red-600"
              >
                🔻CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top controls */}
      <div className="flex items-center flex-wrap justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handlePreset("today")}
            className="w-14 sm:w-auto text-xs sm:text-base"
            variant={`${activePreset === "today" ? "success" : "default"}`}
          >
            Today
          </Button>
          <Button
            onClick={() => handlePreset("thisWeek")}
            className="w-20 sm:w-auto text-xs sm:text-base"
            variant={`${activePreset === "thisWeek" ? "success" : "default"}`}
          >
            This Week
          </Button>
          <Button
            onClick={() => handlePreset("thisMonth")}
            className="w-20 sm:w-auto text-xs sm:text-base"
            variant={`${activePreset === "thisMonth" ? "success" : "default"}`}
          >
            This Month
          </Button>
        </div>

        <div className="relative hidden sm:inline-block text-left  ">
          <div>
            <button
              type="button"
              className="inline-flex active:scale-95 mr-2 cursor-pointer"
              aria-expanded={showDownloadMenu}
              onClick={() => setShowDownloadMenu((prev) => !prev)}
            >
              <Download />

            </button>
          </div>
          {showDownloadMenu && (
            <div className="origin-top-right absolute right-0  mt-2 w-44 rounded-md shadow-xl bg-white border-2 overflow-hidden">
              <button
                onClick={() => {
                  setShowDownloadMenu(false);
                  // downloadPDF();
                }}
                className="w-full text-center text-black border-primary px-4 py-3 text-sm font-semibold hover:bg-gray-100 hover:text-red-600"
              >
                🔻Download as PDF
              </button>
              <button
                onClick={() => {
                  setShowDownloadMenu(false);
                  // downloadCSV();
                }} className="w-full text-center text-black border-t border-primary px-4 py-3 text-sm font-semibold hover:bg-gray-100 hover:text-red-600"
              >
                🔻Downlaod as CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6 overflow-auto text-black">
        {/* Filter */}
        <div className="rounded-lg shadow p-4 text-black" style={{ background: "linear-gradient(15deg,#c3e4e6,#82C3C7)" }} >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5h18M6 12h12M10 19h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <h5 className="font-semibold underline underline-offset-4">Filter Sales</h5>
          </div>
          <form
            onSubmit={handleApplyFilters}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium mb-1">Start Date</Label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (error) setError("");
                }}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-md border border-primary px-3 py-2"
              />
              {error && <p className="text-xs text-red-600 font-roboto pl-1 pt-1">{error}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">End Date</Label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (error) setError("");
                }}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-md border-1 border-primary px-3 py-2"
              />
              {error && <p className="text-xs text-red-600 font-roboto pl-1 pt-1">{error}</p>}
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg py-2 mt-2 font-semibold border-1 active:scale-98 bg-green-400/50"
              >
                Apply Filters
              </button>
            </div>
            <div className="sm:col-span-2">
              <button type="button"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setError("");
                }}
                className="w-full cursor-pointer font-semibold rounded-lg py-2 mt-1 border-1 bg-blue-400/50 active:scale-98" >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="rounded-lg shadow p-4" style={{ background: "linear-gradient(15deg,#c3e4e6,#82C3C7)" }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <h5 className="font-semibold underline underline-offset-4">Sales Summary</h5>
          </div>
          <div className="flex gap-5">
            <div className="border-r-1 w-full p-2 flex flex-col gap-2">
              {[
                { label: "Total Sales", color: "text-emerald-600", value: salesReport && !loading ? salesReport.totalCompletedSaleAmount + salesReport.refundAmount : null, },
                { label: "Earning's", color: "text-green-500", value: salesReport?.totalCompletedSaleAmount },
                { label: "Penality-Fee", color: "text-red-500", value: salesReport?.refundAmount },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-1">
                  <p className="font-serif">{item.label}:</p>
                  {loading ? (
                    <span className={`animate-pulse text-sm pl-2 ${item.color}`}>
                      loading...
                    </span>
                  ) : (
                    <strong className={`${item.color} text-lg font-mono`}>
                      {item.value ?? "N/A"}
                    </strong>
                  )}
                </div>
              ))}
            </div>

            <div className="border-l-1 w-full p-2 flex flex-col gap-2">
              {[
                { label: "Total Bookings", color: "text-gray-800", value: salesReport?.summaryCount.total },
                { label: "Pending", color: "text-cyan-700", value: salesReport?.summaryCount.pendingWork },
                { label: "Canceled", color: "text-red-600", value: salesReport?.summaryCount.cancelled },
                { label: "Completed", color: "text-green-500", value: salesReport?.summaryCount.completed },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-1">
                  <p className="font-serif">{item.label}:</p>
                  {loading ? (
                    <span className={`animate-pulse text-sm pl-5 ${item.color}`}>
                      loading...
                    </span>
                  ) : (
                    <strong className={`${item.color} text-lg font-mono `}>
                      {item.value ?? "N/A"}
                    </strong>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div >

      {/* Orders Table */}
      <SalesReportTable data={salesReport?.completeHistory ?? []} loading={loading} />
    </div >
  );
};

export default Sales;