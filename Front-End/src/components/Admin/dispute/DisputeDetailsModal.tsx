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
import type { DisputeStatus, DisputeType } from "@/shared/enums/Dispute";

interface UserInfo {
	name: string;
	email: string;
	role: string;
	avatar?: string;
}

interface DisputeDetailsModalProps {
	open: boolean;
	onClose: () => void;
	disputeInfo: {
		disputeId: string;
		status: DisputeStatus;
		reporter: UserInfo;
		reportedUser: UserInfo;
		disputeType: DisputeType;
		content: {
			title: string;
			description: string;
			rating?: number;
			date: string;
		};
		reportReason: string;
	};
	onDismiss: () => void;
	onBlock: () => void;
	onDeleteReview: () => void;
}

const DisputeDetailsModal = ({ open, onClose, disputeInfo, onDismiss, onBlock, onDeleteReview }: DisputeDetailsModalProps) => {
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
            <div>
							Dispute ID:{" "}
              <span className="text-zinc-300">{disputeInfo.disputeId}</span>
            </div>
            <div>
              <Badge
                variant="outline"
                className={`${disputeInfo.status === "Pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : disputeInfo.status === "Resolved"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {disputeInfo.status}
              </Badge>
            </div>

          </DialogDescription>
        </DialogHeader>

        {/* Reporter & Reported User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Card className="bg-zinc-900 border-zinc-800 p-0 ">
            <CardContent className="p-2 px-4">
              <h3 className="font-semibold mb-2">Reporter</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  {disputeInfo.reporter.avatar ? (
                    <img
                      src={disputeInfo.reporter.avatar}
                      alt={disputeInfo.reporter.name}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {disputeInfo.reporter.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{disputeInfo.reporter.name}</p>
                  <p className="text-xs text-zinc-400">
                    {disputeInfo.reporter.email}
                  </p>
                  <p className="text-xs text-zinc-500">
										Role: {disputeInfo.reporter.role}
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
                  {disputeInfo.reportedUser.avatar ? (
                    <img
                      src={disputeInfo.reportedUser.avatar}
                      alt={disputeInfo.reportedUser.name}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {disputeInfo.reportedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{disputeInfo.reportedUser.name}</p>
                  <p className="text-xs text-zinc-400">
                    {disputeInfo.reportedUser.email}
                  </p>
                  <p className="text-xs text-zinc-500">
										Role: {disputeInfo.reportedUser.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reported Review */}
        {disputeInfo.disputeType === "Review" ? (
          <div className="mt-2">
            <h3 className="font-semibold mb-2">Reported Review</h3>
            <Card className="bg-zinc-900 border-zinc-800 p-0">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold text-zinc-200">{disputeInfo.content.title}</p>
                  {disputeInfo.content.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{disputeInfo.content.rating}/5</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-400">{disputeInfo.content.description}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="w-3 h-3" />
                  <span>{disputeInfo.content.date}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : disputeInfo.disputeType === "Chat" ? (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Reported Chat</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-zinc-300">
									Reported Message:
                </p>
                <div className="p-2 bg-zinc-800/60 rounded-md text-xs text-zinc-400 italic">
									“{disputeInfo.content.description}”
                </div>
                <p className="text-xs text-zinc-500 mt-1">
									Date: {disputeInfo.content.date}
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
              {disputeInfo.reportReason}
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
