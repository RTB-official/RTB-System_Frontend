import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ActionMenuProps {
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onResetPassword?: () => void;
    onLogout?: () => void;
    onDownload?: () => void;
    downloadLabel?: string;
    showDelete?: boolean;
    headerContent?: React.ReactNode;
    showLogout?: boolean;
    placement?: "right" | "bottom-right" | "bottom-left";
    width?: string;
}

const IconEdit = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path d="M4 21v-3.5L17.5 4.5a2 2 0 012.8 0l0 0a2 2 0 010 2.8L7.5 20.5H4z" />
    </svg>
);

const IconTrash = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path d="M3 6h18" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);

const IconDownload = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
    </svg>
);

const IconLock = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const IconLogout = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
    </svg>
);

export default function ActionMenu({
    isOpen,
    anchorEl,
    onClose,
    onEdit,
    onDelete,
    onResetPassword,
    onLogout,
    onDownload,
    downloadLabel = "PDF 다운로드",
    showDelete = true,
    headerContent,
    showLogout = true,
    placement = "bottom-right",
    width = "w-64",
}: ActionMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // 바깥 클릭 닫기
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

    // ESC 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !anchorEl) return null;

    // width 값에서 숫자 추출 (w-64 -> 256px 등)
    const getWidthValue = (w: string) => {
        const match = w.match(/w-\[(\d+)px\]/);
        if (match) return parseInt(match[1]);
        const tailwindWidths: Record<string, number> = {
            "w-44": 176,
            "w-48": 192,
            "w-56": 224,
            "w-60": 240,
            "w-64": 256,
            "w-72": 288,
            "w-80": 320,
        };
        return tailwindWidths[w] || 256;
    };

    const menuWidthPx = getWidthValue(width);
    const rect = anchorEl.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.right - menuWidthPx;

    if (placement === "right") {
        top = rect.top;
        left = rect.right + 12;
    } else if (placement === "bottom-left") {
        top = rect.bottom + 8;
        left = rect.left;
    }

    // 화면 밖으로 나가는 것 방지
    if (left < 12) left = 12;
    if (left + menuWidthPx > window.innerWidth - 12) {
        left = window.innerWidth - menuWidthPx - 12;
    }

    return createPortal(
        <div
            ref={menuRef}
            className={`fixed ${width} rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 p-3 flex flex-col gap-1 z-[9999]`}
            style={{
                top,
                left,
            }}
        >
            {headerContent && (
                <>
                    <div className="px-2 py-2 mb-1">{headerContent}</div>
                    <div className="h-px bg-gray-300 mx-2 mb-2" />
                </>
            )}
            {onEdit && (
                <button
                    className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                        onEdit();
                        onClose();
                    }}
                >
                    <div className="text-gray-500">
                        <IconEdit />
                    </div>
                    수정
                </button>
            )}
            {onResetPassword && (
                <button
                    className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                        onResetPassword();
                        onClose();
                    }}
                >
                    <div className="text-gray-500">
                        <IconLock />
                    </div>
                    비밀번호 재설정
                </button>
            )}
            {onDownload && (
                <button
                    className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                        onDownload();
                        onClose();
                    }}
                >
                    <div className="text-gray-500">
                        <IconDownload />
                    </div>
                    {downloadLabel}
                </button>
            )}
            {showDelete && onDelete && (
                <button
                    className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-red-50 active:bg-red-100 text-red-600 flex items-center gap-3 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                >
                    <div className="text-red-400">
                        <IconTrash />
                    </div>
                    삭제
                </button>
            )}
            {showLogout && onLogout && (
                <button
                    className="w-full px-3 py-2.5 text-left text-[15px] hover:bg-gray-50 active:bg-gray-100 text-gray-800 flex items-center gap-3 border-t border-gray-100 mt-1 pt-3 rounded-none rounded-b-lg cursor-pointer"
                    onClick={() => {
                        onLogout();
                        onClose();
                    }}
                >
                    <div className="text-gray-500">
                        <IconLogout />
                    </div>
                    로그아웃
                </button>
            )}
        </div>,
        document.body
    );
}
