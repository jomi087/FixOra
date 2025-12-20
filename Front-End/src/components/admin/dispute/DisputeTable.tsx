import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Dispute } from "@/shared/types/dispute";
import { shortId, toPascalCase } from "@/utils/helper/utils";
import { useNavigate } from "react-router-dom";

interface DisputeTableProps {
  disputes: Dispute[];
}

export const DisputeTable: React.FC<DisputeTableProps> = ({ disputes }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md text-nav">
      <Table>
        <TableHeader >
          <TableRow>
            <TableHead className="text-primary font-bold">Dispute ID</TableHead>
            <TableHead className="text-primary text-center font-bold">Type</TableHead>
            <TableHead className="text-primary text-center font-bold">Reason</TableHead>
            <TableHead className="text-primary text-center font-bold">Reported By</TableHead>
            <TableHead className="text-primary text-center font-bold">Status</TableHead>
            <TableHead className="text-primary text-center font-bold">Created At</TableHead>
            <TableHead className="text-primary text-center font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-primary">
          {disputes.length > 0 ? (
            disputes.map((d) => (
              <TableRow key={d.disputeId}>
                <TableCell>{shortId(d.disputeId)}</TableCell>
                <TableCell className="text-center">{d.disputeType}</TableCell>
                <TableCell className="text-center">{toPascalCase(d.reason)}</TableCell>
                <TableCell className="text-center">{toPascalCase(d.reportedBy.name)}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={`px-2 py-1.5 ${d.status === "Pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : d.status === "Resolved"
                        ? "bg-gray-500/30 text-green-400"
                        : "bg-gray-500/30 text-primary-400/50"
                    }`}
                  >
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(d.createdAt), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/disputes/${d.disputeId}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center italic">
                No disputes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};