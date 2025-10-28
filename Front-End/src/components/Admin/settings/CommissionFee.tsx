import { useEffect, useRef, useState } from "react";
import { Card,CardHeader,CardTitle,CardContent,CardFooter, } from "@/components/ui/card";
import { Table,TableHeader,TableRow, TableHead,TableBody,TableCell } from "@/components/ui/table";
import Pagination from "@/components/common/others/Pagination";
import AuthService from "@/services/AuthService";
import type { AxiosError } from "axios";
import { Messages } from "@/utils/constant";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import type { CommissionFee } from "@/shared/types/others";

const CommissionFeeSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  console.log("inputRef", inputRef);
  // ---------------- STATE ----------------
  const [commissionFee, setCommissionFee] = useState<number | null>(null);
  const [commissionFeeData, setCommissionFeeData] = useState<{ amount: number; createdAt: string }[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(commissionFeeData.length / itemsPerPage);

  // ---------------- LOGIC ----------------
  const paginatedCommissionFeeData = commissionFeeData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    const fetchCommissionFee = async () => {
      try {
        setLoading(true);
        const res = await AuthService.commissionFee();
        const commissionFeeData = res.data.commissionFeeData as CommissionFee;
        const fee = commissionFeeData.fee ?? null;
        const history = commissionFeeData.feeHistory ?? [];
        // console.log(typeof commissionFeeData[0].createdAt );
        setCommissionFee(fee);
        setCommissionFeeData(history);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionFee();
  }, []);

  const updateCommissionFee = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;
    const newFee = parseFloat(inputValue);

    if (newFee == commissionFee) {
      toast.info("No changes Made.");
      return;
    }

    if (isNaN(newFee) || newFee < 0) {
      toast.error("Fee must be a positive number");
      return;
    } else if (newFee > 100) {
      toast.error("Prohibited");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.updateCommissionFee(newFee);
      const updatedFeeData = res.data.updatedCommissionFeeData as CommissionFee;
      const updatedFee = updatedFeeData.fee ?? null;
      const history = updatedFeeData.feeHistory ?? [];
      setCommissionFee(updatedFee);
      setCommissionFeeData(history);
      toast.success("commission fee updated successfully!");
      setEditMode(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg =
        err?.response?.data?.message || Messages.FAILED_TO_SAVE_DATA;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------ UI ---------------------------------------------
  return (
    <div className="w-full p-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold  underline underline-offset-4 text-foreground">
        Commission Fee
      </h2>

      {/* Fee Card */}
      <Card>
        <CardHeader>
          <CardTitle className="underline underline-offset-4">Current Fee</CardTitle>
        </CardHeader>

        <CardContent>
          {!editMode ? (
            // View Mode
            <div className="space-y-4 flex justify-between">
              <h2 className={`italic ${commissionFee != null ? "text-3xl font-serif text-green-600" : ""}`}>₹ {loading ? "loading..." : commissionFee != null ? commissionFee : "N/A"}</h2>
              <Button
                className="bg-blue-600  hover:bg-blue-700 text-white font-medium rounded-md transition"
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                Edit
              </Button>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  ref={inputRef}
                  defaultValue={commissionFee ?? ""}
                  className="no-spinner border border-gray-300 rounded-md p-2  w-14 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fee"
                />
                <span className="font-medium">Rs</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={updateCommissionFee}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>

      {/* History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="underline underline-offset-4 font-mono">History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Sr No</TableHead>
                <TableHead className="text-center">Amount (rs)</TableHead>
                <TableHead className="text-center">Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {commissionFeeData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    <h3 className="text-muted-foreground">No records found</h3>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCommissionFeeData.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center" >{(page - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell className="text-center">₹ {tx.amount}</TableCell>
                    <TableCell className="text-center">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPage={setPage}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CommissionFeeSection;