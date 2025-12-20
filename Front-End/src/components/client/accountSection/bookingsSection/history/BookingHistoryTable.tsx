import AuthService from "@/services/AuthService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BookingsHistory } from "@/shared/typess/booking";
import { BHPP, Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import BookingHistoryShimmer from "@/components/provider/history/BookingHistoryShimmer";
import Pagination from "@/components/common/other/Pagination";
import { shortBookingId } from "@/utils/helper/utils";

const BookingHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookingHistoryCount, setTotalBookingHistoryCount] = useState(0);
  const itemsPerPage = BHPP || 16;

  const [bookingHistory, setBookingHistory] = useState<BookingsHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const res = await AuthService.bookingHistoryApi(currentPage, itemsPerPage);
        setBookingHistory(res.data.bookingHistoryData);
        setTotalBookingHistoryCount(res.data.total);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingHistory();
  }, [currentPage]);

  const totalPages = useMemo(() =>
    Math.ceil(totalBookingHistoryCount / itemsPerPage)
  , [totalBookingHistoryCount, itemsPerPage]
  );


  const handleBookingDetails = (booking: BookingsHistory) => {
    if (booking.status == BookingStatus.PENDING) {
      toast.error("Opps Wrong-Booking entry");
      return;
    }
    navigate(`/customer/booking-details/${booking.bookingId}`);
  };

  if (isLoading) {
    return <BookingHistoryShimmer />;
  };

  return (
    <>
      {bookingHistory.length === 0 ? (
        <div className="text-body-text overflow-x-auto w-screen border-1 border-primary/50 mx-2 my-5 rounded-md shadow-2xl">
          <p className="text-center py-4">No bookings found</p>
        </div>
      ) : (
        <div className="text-body-text overflow-x-auto w-full min-h-screen p-5">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-roboto   underline underline-offset-8">
              Job History
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {["S.No", "Booking ID", "Date", "Time", "Progress"].map((head) => (
                    <TableHead key={head} className="text-center py-4 uppercase tracking-wide">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookingHistory.map((d, idx) => (
                  <TableRow
                    key={d.bookingId}
                    className="border-b last:border-none hover:bg-secondary transition-colors cursor-pointer"
                    onClick={() => handleBookingDetails(d)}
                  >
                    <TableCell className="text-center py-4 font-medium">{idx + 1}</TableCell>
                    <TableCell className="text-center py-4 md:w-80 truncate">{shortBookingId(d.bookingId)}</TableCell>
                    <TableCell className="text-center py-4">
                      {new Date(d.scheduledAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {new Date(d.scheduledAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell className="text-center py-4 font-semibold">
                      <span className="px-3 py-1 text-sm ">
                        {d.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BookingHistoryTable;