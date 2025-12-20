import { EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import type { providerReviews } from "@/shared/typess/user";
import EditReview from "./EditReview";
import ReportReview from "./ReportReview";



interface ReviewDropdownMenuProps {
  feedbackData: providerReviews
}

const ReviewDropdownMenu: React.FC<ReviewDropdownMenuProps> = ({ feedbackData }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="sm" className="cursor-pointer text-primary" >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel className="sr-only">Review Options</DropdownMenuLabel>
          <DropdownMenuGroup>
            {user && (user.userId != feedbackData.userData.userId) &&
              <ReportReview ratingId={feedbackData.ratingData.ratingId} />
            }
            {user && (user.userId === feedbackData.userData.userId) &&
              <EditReview ratingData={feedbackData.ratingData} />
            }
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
};

export default ReviewDropdownMenu;
