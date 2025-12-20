

const SkeletonInfoCard: React.FC<{ count?: number ,style?: string }> = ({ count = 8, style="pt-15" }) => {
  const placeholders = Array(count).fill(null);
  return (
    <div className={`flex flex-wrap justify-center gap-6 px-4 py-6 max-w-7xl mx-auto ${style} `}>
      {placeholders.map((_, index) => (
        <div
          key={index}
          className="w-full sm:w-[45%] md:w-[30%] lg:w-[23%] animate-pulse"
        >
          <div className="rounded-3xl border border-gray-300 dark:border-white/20 shadow-lg shadow-black p-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-28 h-28 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 mx-auto w-2/3" />
            <div className="space-y-2">
              <div className="flex justify-between px-2">
                <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex justify-between px-2">
                <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonInfoCard;