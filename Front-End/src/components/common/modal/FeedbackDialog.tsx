import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { longInputLength } from "@/utils/constant";
import { DialogDescription } from "@radix-ui/react-dialog";


interface FeedbackDialogProps {
	openFeedback: boolean
	setOpenFeedback: (openFeedback: boolean) => void
	handleSubmit: () => void
	rating: number;
	setRating: (rating: number) => void
	feedback: string;
	setFeedback: (feedback: string) => void
	title: string;
	description: string
	saveButtonNmme: string
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ openFeedback, setOpenFeedback, handleSubmit, rating, setRating, feedback, setFeedback, title, description, saveButtonNmme }) => {
  return (
    <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-roboto text-lg">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {description}
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
            {saveButtonNmme}
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer active:scale-95"
            onClick={() => setOpenFeedback(false)}
          >
			Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;