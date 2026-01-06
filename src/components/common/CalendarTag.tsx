// CalendarTag.tsx
import React from "react";

interface CalendarTagProps {
    title: string;
    color?: string;
    variant?: "event" | "holiday";
    isStart?: boolean;
    isEnd?: boolean;
    width?: string;
    left?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    details?: React.ReactNode;
    isFirstInRow?: boolean;
}

const CalendarTag: React.FC<CalendarTagProps> = ({
    title,
    color = "#60a5fa",
    variant = "event",
    isStart = true,
    isEnd = true,
    width = "100%",
    left = "0%",
    onEdit,
    onDelete,
    onClick,
    details,
    isFirstInRow = false,
}) => {
    const isHoliday = variant === "holiday";

    return (
        <div
            className={`absolute h-6 flex items-center truncate pointer-events-auto group z-10 cursor-pointer
                ${isStart ? "ml-3 rounded-l-sm" : "rounded-l-none"}
                ${isEnd ? "mr-3 rounded-r-sm" : "rounded-r-none"}
                ${isHoliday ? "bg-red-100 text-gray-900" : "text-gray-800"}
            `}
            style={{
                left,
                width,
                background: isHoliday ? undefined : `${color}15`,
            }}
            onClick={(e) => {
                if (onClick && !isHoliday) {
                    e.stopPropagation();
                    onClick();
                }
            }}
        >
            <div
                className={`flex items-center w-full h-full
                    ${!isStart && isFirstInRow ? "pl-9" : "pl-1.5"}
                    ${isEnd ? "pr-1.5" : "pr-0"}
                `}
            >
                <div
                    className="w-1 h-5 rounded-full shrink-0 mr-2"
                    style={{
                        backgroundColor: isHoliday ? "#ef4444" : color,
                    }}
                />
                <span className="text-[15px] font-semibold truncate leading-none">
                    {title}
                </span>
            </div>

            {/* 툴팁/상세 정보 (onEdit, onDelete가 있을 때만 표시) */}
            {(onEdit || onDelete || details) && (
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 whitespace-normal pointer-events-auto">
                    {details}
                    <div className="flex gap-2 mt-3">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                수정
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarTag;

