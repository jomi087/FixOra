
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPage }) => {
  return (
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
  );
};

export default Pagination;