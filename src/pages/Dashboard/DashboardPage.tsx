// DashboardPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import ScheduleModal from "../../components/common/ScheduleModal";
import Sidebar from "../../components/Sidebar";
import CalendarMenu from "../../components/CalendarMenu";
import EventModal from "../../components/EventModal";
import Button from "../../components/common/Button";

function generateMonthGrid(year: number, month: number) {
    const first = new Date(year, month, 1);
    const startDay = first.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = startDay;
    const totalCells = Math.ceil((prevDays + daysInMonth) / 7) * 7;
    const grid: { date: Date; inMonth: boolean }[] = [];

    for (let i = 0; i < totalCells; i++) {
        const dayIndex = i - prevDays + 1;
        const d = new Date(year, month, dayIndex);
        grid.push({ date: d, inMonth: d.getMonth() === month });
    }
    return grid;
}

// 이벤트 구조: 각 이벤트는 고유 ID, 제목, 색상, 시작일, 종료일을 가짐
interface CalendarEvent {
    id: string;
    title: string;
    color: string;
    startDate: string; // YYYY-MM-DD 형식
    endDate: string; // YYYY-MM-DD 형식
}

const sampleEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "휴가 - 강민지",
        color: "#60a5fa",
        startDate: "2024-12-18",
        endDate: "2024-12-20",
    },
    {
        id: "2",
        title: "12월12일 암모니아 교육",
        color: "#fb923c",
        startDate: "2024-12-12",
        endDate: "2024-12-12",
    },
    {
        id: "3",
        title: "태그",
        color: "#bbf7d0",
        startDate: "2024-12-19",
        endDate: "2024-12-21",
    },
];

export default function DashboardPage() {
    const today = new Date();

    const getColumnPadding = (index: number) => {
        if (index === 0) return "pl-9";
        return "px-4";
    };
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const grid = useMemo(() => generateMonthGrid(year, month), [year, month]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(
        null
    );
    const [menuDate, setMenuDate] = useState<string | null>(null);
    const [eventModalOpen, setEventModalOpen] = useState(false);

    const menuOpenRef = React.useRef(menuOpen);
    const menuDateRef = React.useRef(menuDate);

    React.useEffect(() => {
        menuOpenRef.current = menuOpen;
        menuDateRef.current = menuDate;
    }, [menuOpen, menuDate]);

    useEffect(() => {
        const handler = (e: any) => {
            const d = e.detail;
            if (d && d.x != null && d.y != null) {
                if (menuOpenRef.current && menuDateRef.current === d.date) {
                    setMenuOpen(false);
                    setMenuDate(null);
                    setMenuPos(null);
                    return;
                }

                setMenuPos({ x: d.x, y: d.y });
                setMenuDate(d.date);
                setMenuOpen(true);
            }
        };

        window.addEventListener("showCalendarMenu", handler as EventListener);

        const openHandler = (e: any) => {
            const date = e.detail?.date || selectedDateForModal || menuDate;
            const endDate = e.detail?.endDate || selectedEndDateForModal;
            if (date) {
                setSelectedDateForModal(date);
            }
            if (endDate) {
                setSelectedEndDateForModal(endDate);
            }
            setEventModalOpen(true);
            setMenuOpen(false);
            setMenuPos(null);
        };
        window.addEventListener("openEventForm", openHandler as EventListener);

        return () => {
            window.removeEventListener(
                "showCalendarMenu",
                handler as EventListener
            );
            window.removeEventListener(
                "openEventForm",
                openHandler as EventListener
            );
        };
    }, []);

    // (선택) 모바일 사이드바 열릴 때 body 스크롤 잠금
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    const prevMonth = () => {
        if (month === 0) {
            setYear((y) => y - 1);
            setMonth(11);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setYear((y) => y + 1);
            setMonth(0);
        } else {
            setMonth((m) => m + 1);
        }
    };

    const goToday = () => {
        setYear(today.getFullYear());
        setMonth(today.getMonth());
    };

    // Schedule modal state
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [selectedDateForModal, setSelectedDateForModal] =
        useState<string>("");
    const [selectedEndDateForModal, setSelectedEndDateForModal] =
        useState<string>("");
    // 이벤트를 날짜별로 그룹화
    const [allEvents, setAllEvents] = useState<CalendarEvent[]>(sampleEvents);

    // 날짜별로 그룹화된 이벤트를 계산
    const calendarEvents = useMemo(() => {
        const grouped: Record<string, CalendarEvent[]> = {};
        allEvents.forEach((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            for (
                let d = new Date(start);
                d <= end;
                d.setDate(d.getDate() + 1)
            ) {
                const dateKey = `${d.getFullYear()}-${String(
                    d.getMonth() + 1
                ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                // 중복 체크 (같은 ID가 이미 있으면 추가하지 않음)
                if (!grouped[dateKey].some((e) => e.id === event.id)) {
                    grouped[dateKey].push(event);
                }
            }
        });
        return grouped;
    }, [allEvents]);

    // 드래그 선택 상태
    const [dragStart, setDragStart] = useState<string | null>(null);
    const [dragEnd, setDragEnd] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // 전역 마우스 이벤트로 드래그 처리
    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                const dragDuration =
                    dragStart && dragEnd && dragStart !== dragEnd;
                if (dragStart && dragEnd && dragDuration) {
                    // 드래그가 끝나면 모달 열기
                    const ev = new CustomEvent("openEventForm", {
                        detail: {
                            date: dragStart,
                            endDate: dragEnd,
                        },
                    });
                    window.dispatchEvent(ev);
                }
                setDragStart(null);
                setDragEnd(null);
            }
        };

        if (isDragging) {
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, dragStart, dragEnd]);

    // 날짜 범위에 해당하는 이벤트를 가져오는 헬퍼 함수
    const getEventsForDate = (dateKey: string): CalendarEvent[] => {
        return calendarEvents[dateKey] || [];
    };

    // 이벤트가 특정 날짜에서 시작/종료/중간인지 확인하는 헬퍼 함수
    const getEventPosition = (
        event: CalendarEvent,
        dateKey: string
    ): "start" | "middle" | "end" | "single" => {
        if (event.startDate === event.endDate) {
            return "single";
        }
        if (event.startDate === dateKey) {
            return "start";
        }
        if (event.endDate === dateKey) {
            return "end";
        }
        return "middle";
    };

    // 날짜 범위 포맷팅 함수
    const formatDateRange = (startDate: string, endDate: string): string => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startStr = `${start.getMonth() + 1}월 ${start.getDate()}일`;
        const endStr = `${end.getMonth() + 1}월 ${end.getDate()}일`;

        if (startDate === endDate) {
            return `${startStr}`;
        }
        return `${startStr} ~ ${endStr}`;
    };

    // 일정 저장 핸들러
    const handleEventSave = (data: {
        title: string;
        startDate: string;
        startTime?: string;
        endDate: string;
        endTime?: string;
        allDay: boolean;
    }) => {
        const colors = ["#60a5fa", "#fb923c", "#bbf7d0", "#fbbf24", "#a78bfa"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // 새 이벤트 생성
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: data.title,
            color: randomColor,
            startDate: data.startDate,
            endDate: data.endDate,
        };

        // 이벤트 목록에 추가
        setAllEvents((prev) => [...prev, newEvent]);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-pretendard">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - 데스크탑 고정, 모바일 슬라이드 */}
            <div
                className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-[239px] h-screen shrink-0
          transform transition-transform duration-300 ease-in-out
          ${
              sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
          }
        `}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* 헤더 없이 사이드바 메뉴 버튼만 표시 */}
                <div className="lg:hidden sticky top-0 z-10 shrink-0 bg-white border-b border-gray-200 px-4 h-18 flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        aria-label="메뉴 열기"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 6H20M4 12H20M4 18H20" />
                        </svg>
                    </button>
                </div>

                <main className="flex-1 flex flex-col pt-4 pb-0">
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold pl-9">
                                {year}년 {month + 1}월
                            </h2>
                            <div className="flex items-center gap-1 pr-9">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevMonth}
                                    icon={
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    }
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToday}
                                >
                                    오늘
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={nextMonth}
                                    icon={
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>

                        <div className="bg-white flex-1 flex flex-col min-h-0 overflow-visible">
                            <div className="grid grid-cols-7 gap-0 shrink-0 border-b border-gray-200">
                                {["일", "월", "화", "수", "목", "금", "토"].map(
                                    (d, i) => (
                                        <div
                                            key={d}
                                            className={`py-3 text-[17px] text-left font-medium ${
                                                i === 0
                                                    ? "text-red-500"
                                                    : i === 6
                                                    ? "text-blue-500"
                                                    : "text-gray-800"
                                            }`}
                                        >
                                            <div className={`${getColumnPadding(i)}`}>
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    {d}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="grid grid-cols-7 gap-0 flex-1 auto-rows-fr relative">
                                {grid.map(({ date, inMonth }, idx) => {
                                    const pad = (n: number) =>
                                        n < 10 ? "0" + n : String(n);
                                    const key = `${date.getFullYear()}-${pad(
                                        date.getMonth() + 1
                                    )}-${pad(date.getDate())}`;
                                    const events = getEventsForDate(key);
                                    const isToday =
                                        date.getFullYear() ===
                                            today.getFullYear() &&
                                        date.getMonth() === today.getMonth() &&
                                        date.getDate() === today.getDate();

                                    // 드래그 선택 범위 확인
                                    const isInDragRange =
                                        dragStart &&
                                        dragEnd &&
                                        (() => {
                                            const start = new Date(dragStart);
                                            const end = new Date(dragEnd);
                                            const current = new Date(key);
                                            const minDate =
                                                start < end ? start : end;
                                            const maxDate =
                                                start < end ? end : start;
                                            return (
                                                current >= minDate &&
                                                current <= maxDate
                                            );
                                        })();

                                    const columnPadding = getColumnPadding(
                                        idx % 7
                                    );

                                    return (
                                        <div
                                            key={idx}
                                            onMouseDown={(e) => {
                                                if (e.button === 0) {
                                                    setIsDragging(true);
                                                    setDragStart(key);
                                                    setDragEnd(key);
                                                    setSelectedDateForModal(
                                                        key
                                                    );
                                                    setSelectedEndDateForModal(
                                                        key
                                                    );
                                                    e.preventDefault();
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                if (isDragging && dragStart) {
                                                    setDragEnd(key);
                                                    setSelectedEndDateForModal(
                                                        key
                                                    );
                                                }
                                            }}
                                            onClick={(e) => {
                                                // 비활성화된 날짜(저번달/다음달)는 클릭 비활성화
                                                if (!inMonth) return;
                                                // 드래그가 아닌 경우에만 메뉴 열기
                                                if (!isDragging && !dragStart) {
                                                const el =
                                                    e.currentTarget as HTMLElement;
                                                const menuWidth = 160;
                                                const menuHeight = 180;
                                                const scrollX =
                                                    window.scrollX ||
                                                    window.pageXOffset;
                                                const scrollY =
                                                    window.scrollY ||
                                                    window.pageYOffset;

                                                    const dateEl =
                                                        el.querySelector(
                                                    "[data-date-number]"
                                                ) as HTMLElement | null;
                                                const anchor = dateEl
                                                    ? dateEl.getBoundingClientRect()
                                                    : el.getBoundingClientRect();

                                                const offsetX = 24;
                                                const offsetY = 24;
                                                const cellRect =
                                                    el.getBoundingClientRect();
                                                const desiredX =
                                                    anchor.right +
                                                    scrollX +
                                                    offsetX;

                                                const maxInsideCellLeft =
                                                    cellRect.left +
                                                    scrollX +
                                                    cellRect.width -
                                                    menuWidth -
                                                    8;
                                                let x = desiredX;
                                                if (
                                                        desiredX >
                                                        maxInsideCellLeft
                                                ) {
                                                    x = Math.max(
                                                        maxInsideCellLeft,
                                                        cellRect.left +
                                                            scrollX +
                                                            8
                                                    );
                                                }

                                                let y =
                                                    anchor.top +
                                                    scrollY -
                                                    offsetY;

                                                const calendarContainer =
                                                    el.closest(
                                                        ".bg-white"
                                                    ) as HTMLElement | null;
                                                const containerRect =
                                                    calendarContainer
                                                        ? calendarContainer.getBoundingClientRect()
                                                        : null;

                                                    const rightLimit =
                                                        containerRect
                                                    ? scrollX +
                                                      containerRect.right -
                                                      menuWidth -
                                                      8
                                                    : scrollX +
                                                      window.innerWidth -
                                                      menuWidth -
                                                      8;

                                                    const leftLimit =
                                                        containerRect
                                                    ? scrollX +
                                                      containerRect.left +
                                                      8
                                                    : scrollX + 8;

                                                if (x > rightLimit) {
                                                    x =
                                                        anchor.left +
                                                        scrollX -
                                                        menuWidth -
                                                        8;
                                                }
                                                if (x < leftLimit)
                                                    x = leftLimit;

                                                const bottomLimit =
                                                    scrollY +
                                                    window.innerHeight -
                                                    menuHeight -
                                                    8;
                                                if (y > bottomLimit)
                                                    y = bottomLimit;
                                                    const topLimit =
                                                        scrollY + 8;
                                                    if (y < topLimit)
                                                        y = topLimit;

                                                    // 날짜를 모달에 전달하기 위해 상태 업데이트
                                                    setSelectedDateForModal(
                                                        key
                                                    );

                                                const ev = new CustomEvent(
                                                    "showCalendarMenu",
                                                    {
                                                        detail: {
                                                            date: key,
                                                            x,
                                                            y,
                                                        },
                                                    }
                                                );
                                                window.dispatchEvent(ev);
                                                }
                                            }}
                                            className={`pt-3 relative ${
                                                idx % 7 < 6
                                                    ? "border-r border-gray-200"
                                                    : ""
                                            } ${
                                                Math.floor(idx / 7) <
                                                Math.floor(grid.length / 7)
                                                    ? "border-b border-gray-200"
                                                    : ""
                                            } ${
                                                inMonth
                                                    ? "cursor-pointer"
                                                    : "cursor-default"
                                            } transition-colors select-none flex flex-col ${
                                                isInDragRange
                                                    ? "bg-blue-50"
                                                    : inMonth
                                                    ? "bg-white hover:bg-gray-50"
                                                    : "bg-white text-gray-400"
                                            }`}
                                            style={{
                                                overflow: "visible",
                                            }}
                                        >
                                            <div
                                                className={`mb-2.5 ${columnPadding} flex items-start`}
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center relative">
                                                    {isToday && (
                                                        <div className="absolute inset-0 rounded-full bg-blue-500" />
                                                    )}
                                                    <div
                                                        data-date-number
                                                        className={`relative z-10 text-[17px] font-medium ${
                                                            isToday
                                                                ? "text-white"
                                                                : !inMonth
                                                                ? "text-gray-400"
                                                                : date.getDay() === 0
                                                                ? "text-red-500"
                                                                : date.getDay() === 6
                                                                ? "text-blue-500"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col gap-1 overflow-visible relative">
                                                {/* 연속된 이벤트를 첫 번째 줄에 배치하고 날짜 사이 패딩을 뛰어넘도록 */}
                                                    {events
                                                    .filter((e) => {
                                                        const pos =
                                                            getEventPosition(
                                                                e,
                                                                key
                                                            );
                                                        // 시작일이거나 단일 날짜 이벤트만 표시 (중간/끝은 시작일의 태그가 이미 표시됨)
                                                        return (
                                                            pos === "start" ||
                                                            pos === "single"
                                                        );
                                                    })
                                                    .slice(0, 3)
                                                    .map((e, eventIdx) => {
                                                        const position =
                                                            getEventPosition(
                                                                e,
                                                                key
                                                            );

                                                        // 연속 이벤트는 시작일에서만 표시하고, 여러 날짜에 걸쳐 표시
                                                        if (
                                                            position === "start"
                                                        ) {
                                                            const startDate =
                                                                new Date(
                                                                    e.startDate
                                                                );
                                                            const endDate =
                                                                new Date(
                                                                    e.endDate
                                                                );
                                                            const totalDays =
                                                                Math.floor(
                                                                    (endDate.getTime() -
                                                                        startDate.getTime()) /
                                                                        (1000 *
                                                                            60 *
                                                                            60 *
                                                                            24)
                                                                ) + 1;

                                                            // 그리드에서 시작일의 인덱스 찾기
                                                            const startIdx =
                                                                grid.findIndex(
                                                                    (item) => {
                                                                        const pad =
                                                                            (
                                                                                n: number
                                                                            ) =>
                                                                                n <
                                                                                10
                                                                                    ? "0" +
                                                                                      n
                                                                                    : String(
                                                                                          n
                                                                                      );
                                                                        const itemKey = `${item.date.getFullYear()}-${pad(
                                                                            item.date.getMonth() +
                                                                                1
                                                                        )}-${pad(
                                                                            item.date.getDate()
                                                                        )}`;
                                                                        return (
                                                                            itemKey ===
                                                                            e.startDate
                                                                        );
                                                                    }
                                                                );

                                                            // 현재 날짜가 시작일인 경우에만 태그 표시
                                                            if (
                                                                startIdx === idx
                                                            ) {
                                                                const widthPercent =
                                                                    totalDays *
                                                                    100;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            e.id
                                                                        }
                                                                        className="absolute top-0 left-0 px-2 py-1 rounded-l-md text-[13px] text-gray-700 truncate shrink-0 z-10 group"
                                                                        style={{
                                                                            background: `${e.color}20`,
                                                                            borderLeft: `3px solid ${e.color}`,
                                                                            width: `${widthPercent}%`,
                                                                        }}
                                                                    >
                                                                        {
                                                                            e.title
                                                                        }
                                                                        {/* 호버 시 상세 정보 툴팁 */}
                                                                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <svg
                                                                                    className="w-5 h-5 text-blue-600"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={
                                                                                            2
                                                                                        }
                                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                    />
                                                                                </svg>
                                                                                <span className="text-base font-bold text-gray-900">
                                                                                    {
                                                                                        e.title
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-500 mb-3">
                                                                                {formatDateRange(
                                                                                    e.startDate,
                                                                                    e.endDate
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                                                                    MK
                                                                                </div>
                                                                                <span className="text-sm text-gray-900">
                                                                                    강민지
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }

                                                        // 단일 날짜 이벤트는 일반적으로 표시
                                                        if (
                                                            position ===
                                                            "single"
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={e.id}
                                                                    className={`px-2 py-1 rounded-md text-[13px] text-gray-700 truncate shrink-0 group relative ${
                                                                        eventIdx ===
                                                                        0
                                                                            ? ""
                                                                            : "mt-1"
                                                                    }`}
                                                                    style={{
                                                                        background: `${e.color}20`,
                                                                        borderLeft: `3px solid ${e.color}`,
                                                                    }}
                                                                >
                                                                    {e.title}
                                                                    {/* 호버 시 상세 정보 툴팁 */}
                                                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <svg
                                                                                className="w-5 h-5 text-blue-600"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                />
                                                                            </svg>
                                                                            <span className="text-base font-bold text-gray-900">
                                                                                {
                                                                                    e.title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 mb-3">
                                                                            {formatDateRange(
                                                                                e.startDate,
                                                                                e.endDate
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                                                                MK
                                                                            </div>
                                                                            <span className="text-sm text-gray-900">
                                                                                강민지
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        return null;
                                                    })}

                                                {/* 연속 이벤트의 중간/끝 부분은 시작일의 태그가 이미 표시되므로 숨김 */}

                                                {events.filter((e) => {
                                                    const pos =
                                                        getEventPosition(
                                                            e,
                                                            key
                                                        );
                                                    return (
                                                        pos === "single" ||
                                                        pos === "start"
                                                    );
                                                }).length > 3 && (
                                                    <div className="text-[13px] text-gray-400 shrink-0 mt-auto">
                                                        +
                                                        {events.filter((e) => {
                                                            const pos =
                                                                getEventPosition(
                                                                    e,
                                                                    key
                                                                );
                                                            return (
                                                                pos ===
                                                                    "single" ||
                                                                pos === "start"
                                                            );
                                                        }).length - 3}
                                                            개
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {menuOpen && menuPos && (
                <div
                    style={{
                        position: "absolute",
                        left: menuPos.x,
                        top: menuPos.y,
                        zIndex: 60,
                    }}
                >
                    <CalendarMenu
                        selectedDate={menuDate}
                        onClose={() => {
                            setMenuOpen(false);
                            setMenuDate(null);
                            setMenuPos(null);
                        }}
                    />
                </div>
            )}

            <EventModal
                isOpen={eventModalOpen}
                onClose={() => {
                    setEventModalOpen(false);
                    setSelectedDateForModal("");
                    setSelectedEndDateForModal("");
                }}
                initialDate={selectedDateForModal || menuDate || undefined}
                initialEndDate={selectedEndDateForModal || undefined}
                onSave={handleEventSave}
            />
            {/* Schedule modal (담당: 재사용 컴포넌트) */}
            <ScheduleModal
                isOpen={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                onSave={(payload) => {
                    console.log("새 일정:", payload);
                    setScheduleModalOpen(false);
                }}
            />
        </div>
    );
}
