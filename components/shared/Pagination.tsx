"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type TablePaginationProps = {
  page: number;              // current page (1-based)
  pageSize: number;          // items per page
  total: number;             // total items
  onPageChange: (page: number) => void;
  isLoading?: boolean;       // disable controls when loading
};

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  isLoading = false,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 1)));

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const handleChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    onPageChange(nextPage);
  };

  // simple helper to build a page list with ellipsis
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const add = (p: number | "ellipsis") => pages.push(p);

    const showLeftDots = page > 4;
    const showRightDots = page < totalPages - 3;

    add(1);
    add(2);

    if (showLeftDots) add("ellipsis");

    const start = Math.max(3, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    for (let p = start; p <= end; p++) {
      if (p === 1 || p === 2 || p === totalPages - 1 || p === totalPages) continue;
      add(p);
    }

    if (showRightDots) add("ellipsis");

    add(totalPages - 1);
    add(totalPages);

    // remove duplicates while preserving order
    const seen = new Set<string>();
    return pages.filter((p) => {
      const key = String(p);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!canGoPrev || isLoading}
              className={`${!canGoPrev || isLoading ? "pointer-events-none opacity-50" : ""} ${page === 1 ? "bg-green-600 text-white hover:bg-green-600/80 hover:text-white" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (!canGoPrev || isLoading) return;
                handleChange(page - 1);
              }}
              
            />
          </PaginationItem>

          {pageNumbers.map((p, index) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isLoading) return;
                    handleChange(p);
                  }}
                  className={`rounded-full ${p === page ? "bg-green-600 text-white hover:bg-green-600/80 hover:text-white" : ""}`}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!canGoNext || isLoading}
               className={` ${!canGoNext || isLoading ? "pointer-events-none opacity-50" : ""} ${page === totalPages ? "bg-green-600 text-white hover:bg-green-600/80 hover:text-white" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (!canGoNext || isLoading) return;
                handleChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
