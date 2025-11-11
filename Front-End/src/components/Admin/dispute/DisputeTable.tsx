import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Dispute, DisputeContent } from "@/shared/types/dispute";
import { shortId, toPascalCase } from "@/utils/helper/utils";
import { Loader2 } from "lucide-react";
import DisputeDetailsModal from "./DisputeDetailsModal";
// import { Contentinfo } from "@/utils/constant";
import AuthService from "@/services/AuthService";

interface DisputeTableProps {
  disputes: Dispute[];
}

export const DisputeTable: React.FC<DisputeTableProps> = ({ disputes }) => {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [contentInfo, setContentInfo] = useState<DisputeContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchDisputeDetails = async (dispute: Dispute) => {
    try {
      setLoadingId(dispute.disputeId);
      const res = await AuthService.getDisputeContentById(dispute.disputeId);
      setSelectedDispute(dispute);
      setContentInfo(res.data.contentData);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

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
                    className={`${d.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : d.status === "Resolved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
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
                    onClick={() => fetchDisputeDetails(d)}
                    disabled={loadingId === d.disputeId}
                  >
                    {loadingId === d.disputeId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "View"
                    )}
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

      {selectedDispute && contentInfo && (
        <DisputeDetailsModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDispute(null);
            setContentInfo(null);
          }}
          dispute={selectedDispute}
          contentInfo={contentInfo}
          onDismiss={() => console.log("Dismissed")}
          onBlock={() => console.log("Blocked")}
          onDeleteReview={() => console.log("Deleted")}
        />
      )}
    </div>
  );
};


