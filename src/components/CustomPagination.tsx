import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { JSX } from "react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | JSX.Element)[] = [];
    const maxVisible = 5;
    const maxPages = Math.min(totalPages, 500); // TMDB API limit

    if (maxPages <= maxVisible) {
      return Array.from({ length: maxPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push(<PaginationEllipsis key="start" />);

    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, maxPages - 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < maxPages - 2)
      pages.push(<PaginationEllipsis key="end" />);
    pages.push(maxPages);

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={`
                ${
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-slate-700"
                }
                cursor-pointer text-white
              `}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={`
                    ${
                      currentPage === page ? "bg-sky-500" : "hover:bg-slate-700"
                    }
                    text-white
                  `}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>{page}</PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={`
                ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-slate-700"
                }
                cursor-pointer text-white
              `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
