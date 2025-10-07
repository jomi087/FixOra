import { ImageModal } from "@/components/common/Others/ImageModal";
import React from "react";


interface WorkProofProps {
  imageUrls: string[]
}

const WorkProof: React.FC<WorkProofProps> = ({ imageUrls }) => {
  return (
    <div className="flex gap-4 p-4 ">
      {imageUrls.map((img, index) => (
        <React.Fragment key={index}>
          <ImageModal
            src={img}
            alt={`completed Image-${index + 1}`}
            triggerImageStyle="w-full h-44"

          />
        </React.Fragment>
      ))
      }
    </div>
  );
};

export default WorkProof;

