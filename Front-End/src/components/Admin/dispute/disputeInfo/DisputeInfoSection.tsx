import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import AuthService from "@/services/AuthService";
import type { DisputeContent } from "@/shared/typess/dispute";
import { longInputLength, Messages, validationMsg } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, FileText, Loader2, Shield, Star, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toPascalCase } from "@/utils/helper/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DisputeStatus, DisputeType } from "@/shared/enums/Dispute";
import { Input } from "@/components/ui/input";
import { updateDisputeStatus } from "@/store/admin/disputeSlice";


const DisputeInfoSection = () => {
  const { disputeId } = useParams<{ disputeId: string }>();

  const { disputes } = useAppSelector((state) => state.disputes);
  const dispute = disputeId ? disputes.find((d) => d.disputeId === disputeId) : undefined;


  const [contentInfo, setContentInfo] = useState<DisputeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<DisputeStatus | null>(null);
  const [reason, setReason] = useState("");
  const [inputErrorMsg, setInputErrorMsg] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!disputeId) {
      setErrorMsg("INVALID OR MISSING DISPUTE ID");
      setLoading(false);
      return;
    }

    const fetchDisputeDetails = async () => {
      try {
        setLoading(true);
        const res = await AuthService.getDisputeContentById(disputeId);
        setContentInfo(res.data.contentData);
        setErrorMsg(null);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const msg = err?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputeDetails();
  }, [disputeId]);

  const askConfirmation = (type: DisputeStatus) => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirm = useCallback(async () => {
    if (!actionType || !dispute?.disputeId) {
      toast.error("Something Went Wrong");
      return;
    }
    if (!reason.trim()) {
      setInputErrorMsg(validationMsg.INVALID);
      return;
    } else if (reason.length < 5) {
      setInputErrorMsg(validationMsg.MIN_LENGTH(5));
      return;
    }

    try {
      const res = await AuthService.disputeAction(dispute.disputeId, reason, actionType);
      const updatedStatus = res.data.disputeStatus;
      const adminNote = res.data.adminNote as { name: string, action: string };
      dispatch(updateDisputeStatus({ disputeId: dispute.disputeId, status: updatedStatus, adminNote, }));
      setConfirmOpen(false);
      setReason("");
      setInputErrorMsg("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(msg);
    };

  }, [actionType, dispute?.disputeId, reason]);

  if (loading) {
    return (
      <div className="border flex justify-center items-center text-center text-gray-500 w-full h-[86vh] gap-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        <span>Loading dispute details...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex justify-center items-center text-center text-gray-500 w-full h-[86vh]">
        <div className="space-y-5">
          <p className="text-red-400 font-mono underline underline-offset-8">{errorMsg}</p>
          <Link to="/admin/disputes">
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!contentInfo || !dispute) {
    return (
      <div className="flex justify-center items-center text-center text-gray-500 w-full h-[86vh]">
        <div>
          <p>No dispute information found.</p>
          <Link to="/admin/disputes">
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Breadcrumb */}
      <nav className="pt-4 px-6 text-sm text-primary/80">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <Link to="/admin/disputes">
              Disputes
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold">Info</li>
        </ol>
      </nav>

      {/* Main container */}
      <div className="m-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-primary">Dispute Details</h2>
            <p className="text-xs text-zinc-500 mt-1">
              ID: <span className="text-cyan-400 font-mono">{dispute.disputeId}</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md ${dispute.status === "Pending"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-700"
              : dispute.status === "Resolved"
                ? "bg-green-500/20 text-green-400 border-green-700"
                : "bg-gray-700/50 text-primary border-gray-600"
            }`}
          >
            {dispute.status}
          </Badge>
        </div>

        {/* Reporter + Reported */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Reporter */}
          <Card className="bg-primary-foreground border border-primary/15 backdrop-blur-sm shadow-xl hover:shadow-cyan-900/30 transition-shadow">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 text-cyan-400 border-b border-cyan-800/40 pb-1">Reporter</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-600 flex items-center justify-center text-xl font-bold text-cyan-700 dark:text-white">
                  {dispute.reportedBy.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {toPascalCase(dispute.reportedBy.name)}
                  </p>
                  <p className="text-sm text-zinc-400">{dispute.reportedBy.email}</p>
                  <Badge variant="outline" className="text-xs mt-1 border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
                    {toPascalCase(dispute.reportedBy.role)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reported User */}
          <Card className="bg-primary-foreground border border-primary/15 backdrop-blur-sm shadow-xl hover:shadow-red-900/30 transition-shadow">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 text-red-400 border-b border-red-800/40 pb-1">Reported User</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-600 flex items-center justify-center text-xl font-bold text-rose-700 dark:text-white overflow-hidden">
                  {contentInfo.user.avatar ? (
                    <img
                      src={contentInfo.user.avatar}
                      alt={contentInfo.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    contentInfo.user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {toPascalCase(contentInfo.user.name)}
                  </p>
                  <p className="text-sm text-zinc-400">{contentInfo.user.email}</p>
                  <Badge variant="outline" className="text-xs mt-1 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300">
                    {toPascalCase(contentInfo.user.role)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reported Review / Chat */}
        {dispute.disputeType === DisputeType.REVIEW && (
          <Card className="bg-card border-border overflow-hidden p-0  shadow-xl hover:shadow-red-900/30 transition-shado">
            <div className="bg-rose-50 dark:bg-rose-500/5 p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-600 dark:text-rose-400 text-base">Reported Review</h3>
                  <p className="text-xs text-muted-foreground">Content under investigation</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-foreground leading-relaxed mb-3 text-sm">
                  {toPascalCase(contentInfo.description ?? "N/A")}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(contentInfo.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                  {contentInfo.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-600 font-semibold text-sm">{contentInfo.rating}</span>
                      <span className="text-muted-foreground text-sm">/5</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* forchat type */}
        {/* <div className="mt-4">
          <h3 className="font-semibold mb-2">Reported Chat</h3>
          <Card className="bg-primary-foreground">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-zinc-300">Reported Message:</p>
              <div className="p-2 bg-zinc-800/60 rounded-md text-xs text-zinc-400 italic">
                “{contentInfo.description}”
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Date: {contentInfo.date}
              </p>
            </CardContent>
          </Card>
        </div> */}

        {/* Reason */}
        <Card className="bg-card border-border overflow-hidden p-0  shadow-xl hover:shadow-cyan-900/30 transition-shadow ">
          <div className="bg-cyan-50 dark:bg-cyan-500/5 p-4 border-b border-border">
            <div className="flex items-center gap-3 ">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-cyan-600 dark:text-cyan-400 text-base">Report Reason</h3>
                <p className="text-xs text-muted-foreground">Explanation provided by reporter</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 pt-2 ">
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <p className="text-foreground leading-relaxed font-medium text-sm">
                {dispute.reason}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Summary */}
        {dispute.status !== DisputeStatus.PENDING && dispute.adminNote && (
          <Card className="bg-card border-emerald-200 dark:border-emerald-500/20 overflow-hidden p-0  shadow-xl hover:shadow-green-900/30 transition-shado">
            <div className="bg-emerald-50 dark:bg-emerald-500/5 p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 text-base">Admin Action Summary</h3>
                  <p className="text-xs text-muted-foreground">Resolution details</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-15 h-15 rounded-full bg-emerald-100 dark:bg-emerald-600 flex items-center justify-center text-emerald-700 dark:text-white font-bold text-lg">
                  {dispute.adminNote.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-base">{dispute.adminNote.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Action Taken</p>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg px-3 py-2">
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                    {toPascalCase(dispute.adminNote.action)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {dispute.status === DisputeStatus.PENDING && (
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-foreground font-semibold text-base mb-1">Take Action</h3>
                  <p className="text-sm text-muted-foreground">Review the dispute and decide on an appropriate action</p>
                </div>
                <div className="flex  flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 dark:border-emerald-600/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    onClick={() => askConfirmation(DisputeStatus.REJECTED)}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={() => askConfirmation(DisputeStatus.RESOLVED)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    Delete Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-cyan-400">
              Confirm Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 text-sm">
              This action cannot be undone. Please explain briefly why this decision is being made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-3">
            <Input
              className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-cyan-500"
              placeholder="Enter a short reason..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim().length > 0) setInputErrorMsg("");
              }}
              maxLength={longInputLength}
            />
            {inputErrorMsg && (
              <p className="text-sm text-red-400 mt-1">{inputErrorMsg}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleConfirm} className="bg-cyan-600 hover:bg-cyan-500 text-white">
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

};

export default DisputeInfoSection;
