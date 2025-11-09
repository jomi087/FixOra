"use client";

import * as React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Dispute } from "@/shared/types/dispute";
import { toPascalCase } from "@/utils/helper/utils";

interface Props {
	disputes: Dispute[];
}

export const DisputeTable: React.FC<Props> = ({ disputes }) => {
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
                <TableCell className="py-3">{d.disputeId.split("-")[0] }</TableCell>
                <TableCell className="py-3 text-center">{d.disputeType}</TableCell>
                <TableCell className="py-3 text-center font-semibold font-roboto">{toPascalCase(d.reason)}</TableCell>
                <TableCell className="py-3 text-center">{d.reportedBy.toUpperCase()}</TableCell>
                <TableCell className="py-3 text-center">
                  <Badge
                    variant="secondary"
                    className={
                      d.status === "Resolved"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : d.status === "Rejected"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                    }
                  >
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center">{format(new Date(d.createdAt), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-center py-3 ">
                  <Button variant="outline" size="sm" className="cursor-pointer active:scale-93">
										View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-[calc(100vh-34vh)] text-center text-muted-foreground italic font-mono text-lg"
              >
								No disputes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div >
  );
};
