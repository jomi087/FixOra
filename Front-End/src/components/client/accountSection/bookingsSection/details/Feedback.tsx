import { useState } from "react";
import FeedbackDialog from "@/components/common/modal/FeedbackDialog";

interface FeedbackProps {
  openFeedBack: boolean
  setOpenFeedBack: (openFeedBack: boolean) => void
  handleFeedBack: (data: { rating: number, feedback: string }) => Promise<void>
}

const Feedback: React.FC<FeedbackProps> = ({ openFeedBack, setOpenFeedBack, handleFeedBack }) => {

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    handleFeedBack({ rating, feedback });
  };

  return (
    <FeedbackDialog
      openFeedback={openFeedBack}
      setOpenFeedback={setOpenFeedBack}
      handleSubmit={handleSubmit}
      rating={rating}
      setRating={setRating}
      feedback={feedback}
      setFeedback={setFeedback}
      title="Send us your Feedback"
      description="We’d love to hear your thoughts! Please rate your experience and share suggestions to help us improve."
      saveButtonNmme="Send Feedback"
    />
  );
};

export default Feedback;