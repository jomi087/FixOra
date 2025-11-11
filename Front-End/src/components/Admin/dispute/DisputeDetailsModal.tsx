import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Star } from "lucide-react";
import type { Dispute, DisputeContent } from "@/shared/types/dispute";
import { toPascalCase } from "@/utils/helper/utils";


interface DisputeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  dispute: Dispute;
  contentInfo: DisputeContent;
  onDismiss: () => void;
  onBlock: () => void;
  onDeleteReview: () => void;
}

const DisputeDetailsModal = ({ open, onClose, dispute, contentInfo, onDismiss, onBlock, onDeleteReview }: DisputeDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="!max-w-2xl w-full max-h-[96vh] overflow-y-auto thin-scrollbar gap-3 sm:p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-red-500 flex items-center gap-2">
              ⚠️ Review Dispute Details
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm flex justify-between items-center mt-1">
            <span>
              Dispute ID: <span className="text-zinc-300">{dispute.disputeId}</span>
            </span>
            <Badge
              variant="outline"
              className={`${dispute.status === "Pending"
                ? "bg-yellow-500/20 text-yellow-400"
                : dispute.status === "Resolved"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {dispute.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Reporter & Reported User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Card className="bg-zinc-900 border-zinc-800 p-0 ">
            <CardContent className="p-2 px-4">
              <h3 className="font-semibold mb-2">Reporter</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {dispute.reportedBy.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{toPascalCase(dispute.reportedBy.name)}</p>
                  <p className="text-xs text-zinc-400">
                    {dispute.reportedBy.email}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Role: {toPascalCase(dispute.reportedBy.role)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-0 ">
            <CardContent className="p-2 px-4">
              <h3 className="font-semibold mb-2 text-red-400 flex items-center gap-1">
                ⚠️ Reported User
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  {contentInfo.user.avatar ? (
                    <img
                      src={contentInfo.user.avatar}
                      alt={contentInfo.user.name}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {contentInfo.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{toPascalCase(contentInfo.user.name)}</p>
                  <p className="text-xs text-zinc-400">
                    {contentInfo.user.email}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Role: {toPascalCase(contentInfo.user.role)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reported Review */}
        {dispute.disputeType === "Review" ? (
          <div className="mt-2">
            <h3 className="font-semibold mb-2">Reported Review</h3>
            <Card className="bg-zinc-900 border-zinc-800 p-0">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold font-roboto text-zinc-400">{toPascalCase(contentInfo.description ?? "N/A")}</p>
                  {contentInfo.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{contentInfo.rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(contentInfo.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : dispute.disputeType === "Chat" ? (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Reported Chat</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-zinc-300">
                  Reported Message:
                </p>
                <div className="p-2 bg-zinc-800/60 rounded-md text-xs text-zinc-400 italic">
                  “{contentInfo.description}”
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Date: {contentInfo.date}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Report Reason */}
        <div className="mt-2">
          <h3 className="font-semibold text-red-400 mb-2">Report Reason</h3>
          <Card className="bg-red-950/30 border-red-800 p-2">
            <CardContent className="p-4 text-sm text-red-300">
              {dispute.reason}
            </CardContent>
          </Card>
        </div>

        {/* Resolution Actions */}
        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-green-600 text-green-400 hover:bg-green-950"
            onClick={onDismiss}
          >
            Dismiss Report
          </Button>
          <Button
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-950"
            onClick={onBlock}
          >
            Block User
          </Button>
          <Button variant="destructive" onClick={onDeleteReview}>
            Delete Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDetailsModal;
