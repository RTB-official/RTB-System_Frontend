import React from "react";
import { useNavigate } from "react-router-dom";
import ActionMenu from "./common/ActionMenu";
import { IconCalendar, IconUpload, IconCard } from "./icons/Icons";

interface Props {
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    position?: { x: number; y: number };
    onClose: () => void;
    selectedDate?: string | null;
}

export default function CalendarMenu({
    isOpen,
    anchorEl,
    position,
    onClose,
    selectedDate,
}: Props) {
    const navigate = useNavigate();

    return (
        <ActionMenu
            isOpen={isOpen}
            anchorEl={anchorEl}
            position={position}
            onClose={onClose}
            width="w-44"
            placement="right"
        >
            <button
                className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer font-medium"
                onClick={() => {
                    const ev = new CustomEvent("openEventForm", {
                        detail: { date: selectedDate },
                    });
                    window.dispatchEvent(ev);
                    onClose();
                }}
            >
                <div className="text-gray-500">
                    <IconCalendar className="w-5 h-5" />
                </div>
                일정 추가
            </button>

            <button
                className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer font-medium"
                onClick={() => {
                    navigate("/vacation?openModal=true");
                    onClose();
                }}
            >
                <div className="text-gray-500">
                    <IconUpload className="w-5 h-5" />
                </div>
                휴가 등록
            </button>

            <button
                className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer font-medium"
                onClick={() => {
                    const q = selectedDate
                        ? `?date=${encodeURIComponent(selectedDate)}`
                        : "";
                    navigate(`/expense${q}`);
                    onClose();
                }}
            >
                <div className="text-gray-500">
                    <IconCard className="w-5 h-5" />
                </div>
                개인 지출
            </button>
        </ActionMenu>
    );
}
