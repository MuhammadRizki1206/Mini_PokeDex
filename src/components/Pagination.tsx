import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface Props {
  page: number;
  setPage: (page: number) => void;
  total: number;
}

export default function Pagination({ page, setPage, total }: Props) {
  const isFirst = page === 1;
  const isLast = page === total;

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-10 text-center px-4">
      {/* ⬅️ Previous */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={isFirst}
        className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-medium sm:font-semibold transition-all duration-200 shadow text-xs sm:text-base
          ${
            isFirst
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }
        `}
      >
        <ChevronLeftIcon className="w-3 h-3 sm:w-5 sm:h-5" />
        <span className="hidden xs:inline">Previous</span>
      </button>

      {/* 🔢 Page Number */}
      <span className="text-xs sm:text-lg font-bold text-gray-800 tracking-wide font-mono">
        Page {page} of {total}
      </span>

      {/* ➡️ Next */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={isLast}
        className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-medium sm:font-semibold transition-all duration-200 shadow text-xs sm:text-base
          ${
            isLast
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }
        `}
      >
        <span className="hidden xs:inline">Next</span>
        <ChevronRightIcon className="w-3 h-3 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
