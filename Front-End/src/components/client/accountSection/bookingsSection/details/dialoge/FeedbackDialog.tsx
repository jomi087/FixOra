import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Star } from "lucide-react";
import { longInputLength } from "@/utils/constant";
import { DialogDescription } from "@radix-ui/react-dialog";

interface FeedbackDialogProps {
  openFeedBack: boolean
  setOpenFeedBack: (openFeedBack: boolean) => void
  handleFeedBack: (data: { rating: number, feedback: string }) => Promise<void>
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ openFeedBack, setOpenFeedBack, handleFeedBack }) => {

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    handleFeedBack({ rating, feedback });
  };

  return (
    <Dialog open={openFeedBack} onOpenChange={setOpenFeedBack}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-roboto text-lg">
            Send us your Feedback
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            We’d love to hear your thoughts! Please rate your experience and share suggestions to help us improve.
          </DialogDescription>
        </DialogHeader>

        {/* ⭐ 5-star rating */}
        <div className="flex items-center justify-center gap-2 my-3">
          {[...Array(5)].map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
              >
                <Star
                  className={`w-7 h-7 transition-transform cursor-pointer ${value <= (rating)
                    ? "fill-yellow-400 stroke-yellow-400 scale-110"
                    : "fill-none stroke-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ✍️ Feedback text area */}
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full min-h-[100px] resize-none"
          maxLength={longInputLength}
        />

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            className="cursor-pointer active:scale-95"
            onClick={handleSubmit}
          >
            Send Feedback
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer active:scale-95"
            onClick={() => setOpenFeedBack(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;