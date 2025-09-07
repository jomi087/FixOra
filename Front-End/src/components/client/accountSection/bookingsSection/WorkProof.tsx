

interface WorkProofProps {
	imageUrls: string[]
}

const WorkProof: React.FC<WorkProofProps> = ({ imageUrls }) => {
  return (
    <div className="flex mt-5">
      <div className="border-1 w-full overflow-auto" >
        <div className="flex items-start gap-3">
          { imageUrls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="completed image"
              className="rounded border"
            />
          ))
          }
        </div>
      </div>

    </div>
  );
};

export default WorkProof;

