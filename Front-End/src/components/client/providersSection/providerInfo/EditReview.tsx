import FeedbackDialog from "@/components/common/modal/FeedbackDialog";
import { Messages } from "@/utils/constant";
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


  const handleFeedBack = async () => {
    try {

      // await AuthService.updateFeedbackApi();
      toast.success("Thank you for your valuable feedback");
      setOpenFeedback(false);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
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