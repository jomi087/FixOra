import FeedbackDialog from "@/components/common/modal/FeedbackDialog";
import AuthService from "@/services/AuthService";
import { useAppDispatch } from "@/store/hooks";
import { updateReview } from "@/store/user/providerInfoSlice";
import type { AxiosError } from "axios";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface EditReviewProps {
  ratingData: {
    ratingId: string;
    rating: number;
    feedback: string;
    createdAt: string;
  };
}
const EditReview: React.FC<EditReviewProps> = ({ ratingData }) => {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [ratingStart, setRatingStar] = useState(ratingData.rating);
  const [feedback, setFeedback] = useState(ratingData.feedback);
  const dispatch = useAppDispatch();
  const handleFeedBack = async () => {
    try {
      const previousFeedback = ratingData.feedback;
      if (previousFeedback === feedback && ratingData.rating === ratingStart) {
        toast.info("No change Made");
        return;
      }
      const res = await AuthService.updateFeedbackApi({ ratingId: ratingData.ratingId, rating: ratingStart, feedback: feedback });
      console.log(res.data.updatedFeedbackData); //{ratingId: 'd677b00c-b78c-447f-b840-1b940e4020f7', rating: 2, feedback: 'proffesional doggggg'}
      dispatch(updateReview(res.data.updatedFeedbackData));
      setOpenFeedback(false);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || "Failed to update";
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div
        className="flex gap-2 justify-start items-center border p-1 cursor-pointer"
        onClick={() => setOpenFeedback(true)}
      >
        <SquarePen
          size={16}
          className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
        />
        <p className="font-sans text-sm">Edit</p>
      </div>
      <FeedbackDialog
        openFeedback={openFeedback}
        setOpenFeedback={setOpenFeedback}
        handleSubmit={handleFeedBack}
        rating={ratingStart}
        setRating={setRatingStar}
        feedback={feedback}
        setFeedback={setFeedback}
        title="Edit Your Review"
        description="Update your rating and feedback"
        saveButtonNmme="Save"
      />
    </div>
  );
};

export default EditReview;