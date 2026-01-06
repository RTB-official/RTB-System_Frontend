// DashboardPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import ScheduleModal from "../../components/common/ScheduleModal";
import Sidebar from "../../components/Sidebar";
import CalendarMenu from "../../components/CalendarMenu";
import EventModal from "../../components/EventModal";
import Button from "../../components/common/Button";
import CalendarTag from "../../components/common/CalendarTag";
import BaseModal from "../../components/ui/BaseModal";

// 공휴일 API 정보
const HOLIDAY_API_KEY =
    "cac7adf961a1b55472fa90319e4cb89dde6c04242edcb3d3970ae9e09c931e98";
const HOLIDAY_API_ENDPOINT =
    "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

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
    isHoliday?: boolean;
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
        if (index === 0) return "pl-9 pr-4";
        if (index === 6) return "pl-4 pr-9";
        return "px-4";
    };
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    // 공휴일 상태
    const [holidays, setHolidays] = useState<Record<string, string>>({});

    // 공휴일 데이터 가져오기
    useEffect(() => {
        const fetchYearHolidays = async (targetYear: number) => {
            try {
                // 한 번에 일년치를 가져오려면 반복문이 필요할 수 있으나,
                // 해당 API는 월별 조회가 기본이므로 현재 연도의 1~12월을 가져옵니다.
                const results: Record<string, string> = {};

                // 성능을 위해 병렬 처리
                const fetchPromises = Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, "0");
                    const url = `${HOLIDAY_API_ENDPOINT}?serviceKey=${HOLIDAY_API_KEY}&solYear=${targetYear}&solMonth=${month}&_type=json&numOfRows=100`;
                    return fetch(url).then((res) => res.json());
                });

                const responses = await Promise.all(fetchPromises);

                responses.forEach((data) => {
                    const items = data.response?.body?.items?.item;
                    if (items) {
                        const itemList = Array.isArray(items) ? items : [items];
                        itemList.forEach((item: any) => {
                            // locdate: 20250101 -> 2025-01-01
                            const dateStr = String(item.locdate);
                            const formattedDate = `${dateStr.slice(
                                0,
                                4
                            )}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
                            results[formattedDate] = item.dateName;
                        });
                    }
                });

                setHolidays((prev) => ({ ...prev, ...results }));
            } catch (error) {
                console.error("공휴일 정보를 가져오는데 실패했습니다:", error);
            }
        };

        fetchYearHolidays(year);
        // 연도가 바뀌면 해당 연도 공휴일도 추가로 가져옴
    }, [year]);
    const grid = useMemo(() => generateMonthGrid(year, month), [year, month]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(
        null
    );
    const [menuDate, setMenuDate] = useState<string | null>(null);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(
        null
    );
    const [hiddenEventsModalOpen, setHiddenEventsModalOpen] = useState(false);
    const [hiddenEventsDate, setHiddenEventsDate] = useState<string | null>(
        null
    );
    const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);
    const [selectedEventForDetail, setSelectedEventForDetail] =
        useState<CalendarEvent | null>(null);

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

    // 공휴일 데이터를 연속된 일정으로 병합
    const mergedHolidays = useMemo(() => {
        const merged: CalendarEvent[] = [];
        const sortedKeys = Object.keys(holidays).sort();

        let currentHoliday: {
            title: string;
            start: string;
            end: string;
        } | null = null;

        for (const key of sortedKeys) {
            const title = holidays[key];
            if (!currentHoliday) {
                currentHoliday = { title, start: key, end: key };
            } else if (currentHoliday.title === title) {
                // 다음 날인지 확인
                const prevEndDate = new Date(currentHoliday.end);
                const currentDate = new Date(key);
                const diffTime = currentDate.getTime() - prevEndDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays === 1) {
                    currentHoliday.end = key;
                } else {
                    merged.push({
                        id: `holiday-${currentHoliday.start}`,
                        title: currentHoliday.title,
                        color: "#ef4444",
                        startDate: currentHoliday.start,
                        endDate: currentHoliday.end,
                        isHoliday: true,
                    });
                    currentHoliday = { title, start: key, end: key };
                }
            } else {
                merged.push({
                    id: `holiday-${currentHoliday.start}`,
                    title: currentHoliday.title,
                    color: "#ef4444",
                    startDate: currentHoliday.start,
                    endDate: currentHoliday.end,
                    isHoliday: true,
                });
                currentHoliday = { title, start: key, end: key };
            }
        }

        if (currentHoliday) {
            merged.push({
                id: `holiday-${currentHoliday.start}`,
                title: currentHoliday.title,
                color: "#ef4444",
                startDate: currentHoliday.start,
                endDate: currentHoliday.end,
                isHoliday: true,
            });
        }

        return merged;

        return merged;
    }, [holidays]);

    // 태그 우선순위에 따른 정렬된 이벤트
    const sortedEvents = useMemo(() => {
        const combined = [...allEvents, ...mergedHolidays];
        return combined.sort((a, b) => {
            // 0. 공휴일 우선 순위 (공휴일은 항상 맨 위)
            if (a.isHoliday && !b.isHoliday) return -1;
            if (!a.isHoliday && b.isHoliday) return 1;

            const aStart = new Date(a.startDate).getTime();
            const bStart = new Date(b.startDate).getTime();
            const aEnd = new Date(a.endDate).getTime();
            const bEnd = new Date(b.endDate).getTime();
            const aDuration = aEnd - aStart;
            const bDuration = bEnd - bStart;

            // 1. 연속된 같은 일정 (1일 이상일 경우) - 기간이 긴 순서
            if (aDuration !== bDuration) {
                return bDuration - aDuration;
            }
            // 2. 시간이 빠른 일정 - 시작일이 빠른 순서
            return aStart - bStart;
        });
    }, [allEvents, mergedHolidays]);

    // 주 단위로 그리드 데이터 나누기
    const weeks = useMemo(() => {
        const result = [];
        for (let i = 0; i < grid.length; i += 7) {
            result.push(grid.slice(i, i + 7));
        }
        return result;
    }, [grid]);

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
        if (editingEvent) {
            // 기존 이벤트 수정
            setAllEvents((prev) =>
                prev.map((event) =>
                    event.id === editingEvent.id
                        ? {
                              ...event,
                              title: data.title,
                              startDate: data.startDate,
                              endDate: data.endDate,
                          }
                        : event
                )
            );
            setEditingEvent(null);
        } else {
            // 새 이벤트 생성
            const colors = [
                "#60a5fa",
                "#fb923c",
                "#bbf7d0",
                "#fbbf24",
                "#a78bfa",
            ];
            const randomColor =
                colors[Math.floor(Math.random() * colors.length)];

            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                title: data.title,
                color: randomColor,
                startDate: data.startDate,
                endDate: data.endDate,
            };

            setAllEvents((prev) => [...prev, newEvent]);
        }
    };

    // 일정 삭제 핸들러
    const handleEventDelete = (eventId: string) => {
        setAllEvents((prev) => prev.filter((event) => event.id !== eventId));
        setEditingEvent(null);
        setEventModalOpen(false);
    };

    // 특정 날짜의 이벤트 개수 확인 함수
    const getEventCountForDate = (dateKey: string): number => {
        return sortedEvents.filter((event) => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            const current = new Date(dateKey);
            return current >= eventStart && current <= eventEnd;
        }).length;
    };

    // 특정 날짜의 이벤트 목록 가져오기
    const getEventsForDate = (dateKey: string): CalendarEvent[] => {
        return sortedEvents.filter((event) => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            const current = new Date(dateKey);
            return current >= eventStart && current <= eventEnd;
        });
    };

    // 주 단위 이벤트 렌더링 함수
    const renderWeekRowEvents = (week: { date: Date; inMonth: boolean }[]) => {
        const weekStart = new Date(week[0].date);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(week[6].date);
        weekEnd.setHours(23, 59, 59, 999);

        const dayMs = 24 * 60 * 60 * 1000;

        // 현재 주에 걸쳐 있는 이벤트 세그먼트 추출
        const segments = sortedEvents
            .map((event) => {
                const eventStart = new Date(event.startDate);
                eventStart.setHours(0, 0, 0, 0);
                const eventEnd = new Date(event.endDate);
                eventEnd.setHours(0, 0, 0, 0);

                if (eventEnd < weekStart || eventStart > weekEnd) return null;

                const start = new Date(
                    Math.max(eventStart.getTime(), weekStart.getTime())
                );
                const end = new Date(
                    Math.min(eventEnd.getTime(), weekEnd.getTime())
                );

                const startOffset = Math.round(
                    (start.getTime() - weekStart.getTime()) / dayMs
                );
                const duration =
                    Math.round((end.getTime() - start.getTime()) / dayMs) + 1;

                return { event, startOffset, duration };
            })
            .filter((s) => s !== null) as {
            event: CalendarEvent;
            startOffset: number;
            duration: number;
        }[];

        // 슬롯(행) 할당
        const rows: (typeof segments)[] = [];
        segments.forEach((segment) => {
            let assigned = false;
            for (let i = 0; i < rows.length; i++) {
                const canFit = !rows[i].some(
                    (s) =>
                        segment.startOffset < s.startOffset + s.duration &&
                        s.startOffset < segment.startOffset + segment.duration
                );

                if (canFit) {
                    rows[i].push(segment);
                    assigned = true;
                    break;
                }
            }
            if (!assigned) {
                rows.push([segment]);
            }
        });

        const maxVisibleRows = 3;

        return (
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ top: "50px" }}
            >
                {rows.slice(0, maxVisibleRows).map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="relative h-6 mb-1 w-full flex items-center"
                    >
                        {row.map((segment) => {
                            const left = (segment.startOffset / 7) * 100;
                            const width = (segment.duration / 7) * 100;

                            // 안전하게 날짜 키 생성
                            const getSafeDateKey = (d: Date) => {
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(
                                    2,
                                    "0"
                                );
                                const day = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                );
                                return `${y}-${m}-${day}`;
                            };

                            const startDayDate =
                                week[segment.startOffset]?.date;
                            const endDayDate =
                                week[
                                    Math.min(
                                        6,
                                        segment.startOffset +
                                            segment.duration -
                                            1
                                    )
                                ]?.date;

                            if (!startDayDate || !endDayDate) return null;

                            const isEventStart =
                                segment.event.startDate ===
                                getSafeDateKey(startDayDate);
                            const isEventEnd =
                                segment.event.endDate ===
                                getSafeDateKey(endDayDate);

                            return (
                                <CalendarTag
                                    key={`${segment.event.id}-${segment.startOffset}`}
                                    title={
                                        isEventStart ||
                                        segment.startOffset === 0
                                            ? segment.event.title
                                            : ""
                                    }
                                    variant={
                                        segment.event.isHoliday
                                            ? "holiday"
                                            : "event"
                                    }
                                    color={segment.event.color}
                                    isStart={isEventStart}
                                    isEnd={isEventEnd}
                                    left={`${left}%`}
                                    width={`calc(${width}% - ${
                                        isEventStart ? 12 : 0
                                    }px - ${isEventEnd ? 12 : 0}px)`}
                                    onEdit={
                                        segment.event.isHoliday
                                            ? undefined
                                            : () => {
                                                  setEditingEvent(
                                                      segment.event
                                                  );
                                                  setSelectedDateForModal(
                                                      segment.event.startDate
                                                  );
                                                  setSelectedEndDateForModal(
                                                      segment.event.endDate
                                                  );
                                                  setEventModalOpen(true);
                                              }
                                    }
                                    onDelete={
                                        segment.event.isHoliday
                                            ? undefined
                                            : () =>
                                                  handleEventDelete(
                                                      segment.event.id
                                                  )
                                    }
                                    onClick={
                                        segment.event.isHoliday
                                            ? undefined
                                            : () => {
                                                  setSelectedEventForDetail(
                                                      segment.event
                                                  );
                                                  setEventDetailModalOpen(true);
                                              }
                                    }
                                    details={
                                        segment.event.isHoliday ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 rounded-full bg-red-500 mr-2" />
                                                <span className="text-base font-bold text-gray-900">
                                                    {segment.event.title}
                                                </span>
                                            </div>
                                        ) : (
                                            <>
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
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="text-base font-bold text-gray-900">
                                                        {segment.event.title}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 mb-3">
                                                    {formatDateRange(
                                                        segment.event.startDate,
                                                        segment.event.endDate
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                                        MK
                                                    </div>
                                                    <span className="text-sm text-gray-900">
                                                        강민지
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
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

                <main className="flex-1 flex flex-col pt-9 pb-0">
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
                            <div className="grid grid-cols-7 shrink-0 border-b border-gray-200">
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
                                            <div
                                                className={`${getColumnPadding(
                                                    i
                                                )}`}
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    {d}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex-1 flex flex-col min-h-0 relative">
                                {weeks.map((week, weekIdx) => (
                                    <div
                                        key={weekIdx}
                                        className="flex-1 grid grid-cols-7 border-b border-gray-200 relative overflow-visible"
                                    >
                                        {week.map(
                                            ({ date, inMonth }, dayIdx) => {
                                                const pad = (n: number) =>
                                                    n < 10
                                                        ? "0" + n
                                                        : String(n);
                                                const key = `${date.getFullYear()}-${pad(
                                                    date.getMonth() + 1
                                                )}-${pad(date.getDate())}`;

                                                const isToday =
                                                    date.getFullYear() ===
                                                        today.getFullYear() &&
                                                    date.getMonth() ===
                                                        today.getMonth() &&
                                                    date.getDate() ===
                                                        today.getDate();

                                                // 드래그 선택 범위 확인
                                                const isInDragRange =
                                                    dragStart &&
                                                    dragEnd &&
                                                    (() => {
                                                        const start = new Date(
                                                            dragStart
                                                        );
                                                        const end = new Date(
                                                            dragEnd
                                                        );
                                                        const current =
                                                            new Date(key);
                                                        const minDate =
                                                            start < end
                                                                ? start
                                                                : end;
                                                        const maxDate =
                                                            start < end
                                                                ? end
                                                                : start;
                                                        return (
                                                            current >=
                                                                minDate &&
                                                            current <= maxDate
                                                        );
                                                    })();

                                                const columnPadding =
                                                    getColumnPadding(dayIdx);

                                                return (
                                                    <div
                                                        key={dayIdx}
                                                        onMouseDown={(e) => {
                                                            if (
                                                                e.button === 0
                                                            ) {
                                                                setIsDragging(
                                                                    true
                                                                );
                                                                setDragStart(
                                                                    key
                                                                );
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
                                                            if (
                                                                isDragging &&
                                                                dragStart
                                                            ) {
                                                                setDragEnd(key);
                                                                setSelectedEndDateForModal(
                                                                    key
                                                                );
                                                            }
                                                        }}
                                                        onClick={(e) => {
                                                            if (!inMonth)
                                                                return;
                                                            if (
                                                                !isDragging &&
                                                                !dragStart
                                                            ) {
                                                                const el =
                                                                    e.currentTarget as HTMLElement;
                                                                const dateEl =
                                                                    el.querySelector(
                                                                        "[data-date-number]"
                                                                    ) as HTMLElement | null;
                                                                const anchor =
                                                                    dateEl
                                                                        ? dateEl.getBoundingClientRect()
                                                                        : el.getBoundingClientRect();

                                                                const scrollX =
                                                                    window.scrollX ||
                                                                    window.pageXOffset;
                                                                const scrollY =
                                                                    window.scrollY ||
                                                                    window.pageYOffset;

                                                                const x =
                                                                    anchor.right +
                                                                    scrollX +
                                                                    24;
                                                                const y =
                                                                    anchor.top +
                                                                    scrollY -
                                                                    24;

                                                                setSelectedDateForModal(
                                                                    key
                                                                );
                                                                const ev =
                                                                    new CustomEvent(
                                                                        "showCalendarMenu",
                                                                        {
                                                                            detail: {
                                                                                date: key,
                                                                                x,
                                                                                y,
                                                                            },
                                                                        }
                                                                    );
                                                                window.dispatchEvent(
                                                                    ev
                                                                );
                                                            }
                                                        }}
                                                        className={`pt-3 relative ${
                                                            dayIdx < 6
                                                                ? "border-r border-gray-200"
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
                                                    >
                                                        <div
                                                            className={`${columnPadding} flex items-start`}
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
                                                                            : date.getDay() ===
                                                                              0
                                                                            ? "text-red-500"
                                                                            : date.getDay() ===
                                                                              6
                                                                            ? "text-blue-500"
                                                                            : "text-gray-800"
                                                                    }`}
                                                                >
                                                                    {date.getDate()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* 태그 개수 표시 (+N개) */}
                                                        {(() => {
                                                            const eventCount =
                                                                getEventCountForDate(
                                                                    key
                                                                );
                                                            const threshold = 3;
                                                            if (
                                                                eventCount >
                                                                threshold
                                                            ) {
                                                                return (
                                                                    <div
                                                                        className={`absolute ${columnPadding} pointer-events-auto z-20 cursor-pointer`}
                                                                        style={{
                                                                            top: `${
                                                                                50 +
                                                                                3 *
                                                                                    28
                                                                            }px`,
                                                                        }}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            setHiddenEventsDate(
                                                                                key
                                                                            );
                                                                            setHiddenEventsModalOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <div className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
                                                                            +{" "}
                                                                            {eventCount -
                                                                                threshold}{" "}
                                                                            개
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>
                                                );
                                            }
                                        )}
                                        {/* 현재 주(row)의 이벤트 렌더링 */}
                                        {renderWeekRowEvents(week)}
                                    </div>
                                ))}
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
                    setEditingEvent(null);
                }}
                initialDate={
                    editingEvent
                        ? editingEvent.startDate
                        : selectedDateForModal || menuDate || undefined
                }
                initialEndDate={
                    editingEvent
                        ? editingEvent.endDate
                        : selectedEndDateForModal || undefined
                }
                editingEvent={editingEvent}
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

            {/* 숨겨진 일정 목록 모달 */}
            <BaseModal
                isOpen={hiddenEventsModalOpen}
                onClose={() => {
                    setHiddenEventsModalOpen(false);
                    setHiddenEventsDate(null);
                }}
                title="일정 목록"
                maxWidth="max-w-md"
            >
                {hiddenEventsDate && (
                    <div className="space-y-3">
                        {getEventsForDate(hiddenEventsDate)
                            .slice(3)
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => {
                                        setSelectedEventForDetail(event);
                                        setHiddenEventsModalOpen(false);
                                        setEventDetailModalOpen(true);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: event.color,
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {event.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatDateRange(
                                                    event.startDate,
                                                    event.endDate
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </BaseModal>

            {/* 일정 상세 정보 모달 */}
            <BaseModal
                isOpen={eventDetailModalOpen}
                onClose={() => {
                    setEventDetailModalOpen(false);
                    setSelectedEventForDetail(null);
                }}
                title="일정 상세"
                maxWidth="max-w-md"
                footer={
                    selectedEventForDetail &&
                    !selectedEventForDetail.isHoliday ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setEventDetailModalOpen(false);
                                    setEditingEvent(selectedEventForDetail);
                                    setSelectedDateForModal(
                                        selectedEventForDetail.startDate
                                    );
                                    setSelectedEndDateForModal(
                                        selectedEventForDetail.endDate
                                    );
                                    setEventModalOpen(true);
                                }}
                                className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => {
                                    handleEventDelete(
                                        selectedEventForDetail.id
                                    );
                                    setEventDetailModalOpen(false);
                                    setSelectedEventForDetail(null);
                                }}
                                className="flex-1 h-11 rounded-xl bg-red-50 text-red-600 text-[14px] font-medium hover:bg-red-100 transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    ) : undefined
                }
            >
                {selectedEventForDetail && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full shrink-0"
                                style={{
                                    backgroundColor:
                                        selectedEventForDetail.color,
                                }}
                            />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedEventForDetail.title}
                            </h3>
                        </div>
                        <div className="text-sm text-gray-500">
                            {formatDateRange(
                                selectedEventForDetail.startDate,
                                selectedEventForDetail.endDate
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                MK
                            </div>
                            <span className="text-sm text-gray-900">
                                강민지
                            </span>
                        </div>
                    </div>
                )}
            </BaseModal>
        </div>
    );
}
