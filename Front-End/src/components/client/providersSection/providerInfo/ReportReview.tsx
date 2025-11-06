import ReasonDialog from "@/components/common/modal/ReasonDialog";
import AuthService from "@/services/AuthService";
import type { AxiosError } from "axios";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReportReviewProps {
	ratingId: string;
}
const ReportReview: React.FC<ReportReviewProps> = ({ ratingId }) => {
  const [openReport, setOpenReport] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async (reason: string) => {
    try {
      setLoading(true);
      setOpenReport(false);
      await AuthService.reportReview({ ratingId, reason });
      toast.success("Report submitted SuccessFully");

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || "Failed to send report";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="flex gap-2 justify-start items-center border p-1 cursor-pointer hover:shadow-md"
        onClick={() => setOpenReport(true)}
      >
        <TriangleAlert
          size={16}
          className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
        />
        <p className="font-sans text-sm">Report</p>
      </div>
      <ReasonDialog
        onConfirm={handleReport}
        loading={loading}
        open={openReport}
        setOpen={setOpenReport}
        tittle="Report this review"
        discription="Your report will be carefully reviewed by our team and take action if it’s found to be valid"
        placeholder="Off-Topic, Inappropriate, Fake, Etc..."
      />
    </div>
  );
};

export default ReportReview;