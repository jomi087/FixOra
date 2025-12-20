interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPage }) => {
  const getPageNumbers = () => {
    const range = [];
    const start = Math.max(1, currentPage);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  return (
    <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-3 p-4 sm:p-6">
      <button
        className="px-4 py-1 rounded border disabled:opacity-50 hover:bg-indigo-50"
        onClick={() => currentPage > 1 && onPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {currentPage > 3 && (
        <>
          <button className="px-3 py-1 rounded border" onClick={() => onPage(1)}>1</button>
          {currentPage > 4 && <span className="text-gray-500">...</span>}
        </>
      )}

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`px-3 py-1 rounded border transition-colors duration-200 ${
            currentPage === num
              ? "bg-indigo-600 text-white border-indigo-600"
              : "hover:bg-indigo-50"
          }`}
          onClick={() => onPage(num)}
        >
          {num}
        </button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
          <button className="px-3 py-1 rounded border" onClick={() => onPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="px-4 py-1 rounded border disabled:opacity-50 hover:bg-indigo-50"
        onClick={() => currentPage < totalPages && onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

/* Base Model

    <div className="flex justify-end items-center gap-3 p-6">
      <button
        className="px-4 py-1 rounded border disabled:opacity-50"
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>


      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-indigo-600 text-white" : ""
          }`}
          onClick={() => onPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button className="px-4 py-1 rounded border disabled:opacity-50"
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>

*/
