import Pagination from "@/components/common/others/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProviderReviews } from "@/store/user/providerInfoSlice";
import { RLPP } from "@/utils/constant";
import { toPascalCase } from "@/utils/helper/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const Review: React.FC<{ providerId: string }> = ({ providerId }) => {

  const dispatch = useAppDispatch();
  const { reviews, totalPages } = useAppSelector((state) => state.providerInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = RLPP;

  useEffect(() => {
    dispatch(fetchProviderReviews({ providerId, currentPage, itemsPerPage }));
  }, [dispatch, providerId, currentPage]);

  // console.log("reviews", reviews);

  return (
    <div className="shadow-lg shadow-ring border-2 mt-10 p-6 pt-4  rounded-xl">
      <h3 className="text-lg font-semibold font-roboto py-2">Rating</h3>
      {reviews.map((review) => (
        <div className="p-4 rounded-xl border m-2">
          <h5 className="font-medium text-lg py-2 underline underline-offset-3">{`${toPascalCase(review.userData.fname)} ${toPascalCase(review.userData.lname)}`}</h5>
          <div className="flex gap-1 px-2 py-1">
            <div className="flex gap-1 mb-3 ">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <Star
                    className={`w-5 h-5 transition-transform cursor-pointer ${value <= (review.ratingData.rating)
                      ? "fill-yellow-400 stroke-yellow-400 scale-110"
                      : "fill-none stroke-gray-400"
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-sm">({review.ratingData.rating})</div>
          </div>
          <div className="bg-primary/5 rounded-md p-3 text-primary">
            <p className="font-roboto text-sm">{`${toPascalCase(review.ratingData.feedback)}`}</p>
            <p className="text-end text-[12px]">{new Date(review.ratingData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
      {
        totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPage={setCurrentPage}
            />
          </div>
        )
      }
    </div>
  );
};

export default Review;