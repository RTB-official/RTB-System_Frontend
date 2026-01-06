import React, { useEffect, useRef } from "react";
import { CalendarEvent } from "../../pages/Dashboard/DashboardPage"; // CalendarEvent 인터페이스를 가져옵니다.

interface EventDetailMenuProps {
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    event: CalendarEvent | null;
    onEdit: (event: CalendarEvent) => void;
    onDelete: (eventId: string) => void;
}

const IconCalendar = () => (
    <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

const IconPerson = () => (
    <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);

const EventDetailMenu: React.FC<EventDetailMenuProps> = ({
    isOpen,
    anchorEl,
    onClose,
    event,
    onEdit,
    onDelete,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (anchorEl?.contains(target)) return;
            onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, anchorEl, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !anchorEl || !event) return null;

    const rect = anchorEl.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const left = rect.left + window.scrollX;

    // 날짜 및 시간 포맷팅 (예시)
    const formatDateTimeRange = (
        startDate: string,
        endDate: string
    ): string => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startTime = start.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        const endTime = end.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const startDay = `${start.getMonth() + 1}월 ${start.getDate()}일`;
        const endDay = `${end.getMonth() + 1}월 ${end.getDate()}일`;

        if (startDate === endDate) {
            return `${startDay} ${startTime} ~ ${endTime}`;
        }
        return `${startDay} ${startTime} ~ ${endDay} ${endTime}`;
    };

    return (
        <div
            ref={menuRef}
            className="absolute z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-4 flex flex-col gap-4"
            style={{ top, left }}
        >
            <div className="flex items-center gap-3">
                <IconCalendar />
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
            </div>
            
            <div className="text-sm text-gray-600 pl-8">
                {formatDateTimeRange(event.startDate, event.endDate)}
            </div>

            {/* 참가자 정보 (TODO: 실제 데이터로 교체) */}
            <div className="flex items-center gap-3">
                <IconPerson />
                <div className="flex flex-wrap gap-2">
                    {/* 참가자 더미 데이터 */}
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            MK
                        </div>
                        <span className="text-sm text-gray-800">강민지</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            HJ
                        </div>
                        <span className="text-sm text-gray-800">홍길동</span>
                    </div>
                </div>
            </div>

            {!event.isHoliday && (
                <div className="flex gap-2 mt-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(event);
                            onClose();
                        }}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        수정
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(event.id);
                            onClose();
                        }}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventDetailMenu;
