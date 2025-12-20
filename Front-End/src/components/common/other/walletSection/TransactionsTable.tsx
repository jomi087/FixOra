import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Transaction } from "@/shared/types/wallet";
import { TransactionStatus, TransactionType } from "@/shared/enums/Transaction";
import Pagination from "@/components/common/other/Pagination";
import { shortBookingId, shortId } from "@/utils/helper/utils";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const statusConfig: Record<
  TransactionStatus, {
    color: string;
    icon: React.ReactNode;
    label: string
  }> = {
    [TransactionStatus.SUCCESS]: {
      color: "text-green-600",
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
      label: "Success",
    },
    [TransactionStatus.FAILED]: {
      color: "text-red-600",
      icon: <XCircle className="w-4 h-4 mr-1" />,
      label: "Failed",
    },
    [TransactionStatus.PENDING]: {
      color: "text-yellow-600",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      label: "Pending",
    },
  };

interface TransactionsTableProps {
  transactions: Transaction[]
  page: number;
  setPage: (page: number) => void
  totalPages: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, page, setPage, totalPages }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center" >Sr-No</TableHead>
                <TableHead className="text-center" >Payment ID</TableHead>
                <TableHead className="text-center" >Amount</TableHead>
                <TableHead className="text-center" >Date</TableHead>
                <TableHead className="text-center" >Type</TableHead>
                <TableHead className="text-center" >Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <h3 className="text-muted-foreground">No Transaction Found</h3>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx, idx) => (
                  <TableRow key={tx.transactionId}>
                    <TableCell className="w-2 text-center">{idx + 1}</TableCell>
                    <TableCell className="text-center" >
                      {tx.transactionId === "N/A" ? (
                        <span
                          className="text-red-500"
                        >
                          Payment Not Completed
                        </span>
                      ) : (
                        shortId(tx.transactionId)
                      )}
                    </TableCell>
                    <TableCell className="text-center" >{tx.amount}</TableCell>
                    <TableCell className="text-center" >{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center" >
                      <Badge
                        variant={tx.type === TransactionType.CREDIT ?
                          "success" : tx.type === TransactionType.REFUND ?
                            "default" : "destructive"
                        }
                        className="sm:w-15"
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`flex items-center justify-center ${statusConfig[tx.status].color}`}
                      >
                        {statusConfig[tx.status].icon}
                        {statusConfig[tx.status].label}
                      </span>
                    </TableCell>

                    <TableCell className="w-2 cursor-pointer text-center">
                      {tx.bookingId && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <BsFillInfoCircleFill size={18} />
                              </span>
                            </TooltipTrigger>

                            <TooltipContent side="top">
                              <p >Booking ID: {shortBookingId(tx.bookingId)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>



                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {
        totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPage={setPage}
            />
          </div>
        )
      }
    </>
  );
};

export default TransactionsTable;

/*
<div className="relative group inline-block">
      <BsFillInfoCircleFill size={18} className="cursor-pointer" />
      <div
        className="
          absolute left-1/2 -translate-x-1/2 mt-2
          whitespace-nowrap
          bg-black text-white text-xs px-2 py-1 rounded
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200
        "
      >
        {tx.bookingId}
      </div>
</div >
*/