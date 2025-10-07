import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Transaction } from "@/shared/Types/wallet";
import { TransactionStatus, TransactionType } from "@/shared/enums/Transaction";
import Pagination from "@/components/common/Others/Pagination";


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

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions,page,setPage,totalPages }) => {
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
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <h3 className="text-muted-foreground">No Transaction Found</h3>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.transactionId}>
                    <TableCell>
                      {tx.transactionId === "N/A" ? (
                        <span
                          className="text-red-500"
                        >
                          Payment Not Completed 
                        </span>
                      ) : (
                        tx.transactionId
                      )}
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell >
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
                    <TableCell>
                      <span
                        className={`flex items-center ${statusConfig[tx.status].color}`}
                      >
                        {statusConfig[tx.status].icon}
                        {statusConfig[tx.status].label}
                      </span>
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