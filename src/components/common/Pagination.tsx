import React from "react";
import Button from "./Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationProps) {
    return (
        <div className={`flex justify-center items-center gap-2 pt-1 ${className}`}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg"
                aria-label="prev"
            >
                &lt;
            </Button>

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const active = p === currentPage;
                    return (
                        <Button
                            key={p}
                            variant="ghost"
                            size="sm"
                            onClick={() => onPageChange(p)}
                            className={`rounded-lg ${
                                active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {p}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg"
                aria-label="next"
            >
                &gt;
            </Button>
        </div>
    );
}

