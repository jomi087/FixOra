import FeedbackDialog from "@/components/common/modal/FeedbackDialog";
import AuthService from "@/services/AuthService";
import { useAppDispatch } from "@/store/hooks";
import { updateReview } from "@/store/user/providerInfoSlice";
import type { AxiosError } from "axios";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

interface EditReviewProps {
  rating: {
    ratingId: string;
    rating: number;
    feedback: string;
    createdAt: string;
  };
}
const EditReview: React.FC<EditReviewProps> = ({ rating }) => {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [ratingStart, setRatingStar] = useState(rating.rating);
  const [feedback, setFeedback] = useState(rating.feedback);

  const dispatch = useAppDispatch();

  const handleFeedBack = async () => {
    try {
      const previousFeedback = rating.feedback;
      if (previousFeedback === feedback && rating.rating === ratingStart) {
        toast.info("No change Made");
        return;
      }
      const res = await AuthService.updateFeedbackApi({ ratingId: rating.ratingId, rating: ratingStart, feedback: feedback });
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
      <CiEdit
        size={20}
        className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
        onClick={() => {
          setOpenFeedback(true);
        }}
      />
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