import React from "react";
import CalendarTag from "../common/CalendarTag";
import DayCell from "./DayCell";
import { CalendarEvent } from "../../types";

interface WeekEventSegment {
    event: CalendarEvent;
    startOffset: number;
    duration: number;
    rowIndex: number;
}

interface WeekRowProps {
    week: { date: Date; inMonth: boolean }[];
    weekIdx: number;
    weekEventRows: WeekEventSegment[];
    today: Date;
    dragStart: string | null;
    dragEnd: string | null;
    isDragging: boolean;
    cellRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    getColumnPadding: (dayIdx: number) => string;
    getSafeDateKey: (date: Date) => string;
    getEventsForDate: (dateKey: string) => CalendarEvent[];
    maxVisibleRows: number;
    tagHeight: number;
    tagSpacing: number;
    cellHeights: Record<string, number>;
    onEditEvent: (event: CalendarEvent) => void;
    onDeleteEvent: (eventId: string) => void;
    onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
    onDateClick: (dateKey: string, e: React.MouseEvent) => void;
    onDragStart: (dateKey: string, e: React.MouseEvent) => void;
    onDragEnter: (dateKey: string) => void;
    onHiddenCountClick: (dateKey: string, threshold: number) => void;
}

const WeekRow: React.FC<WeekRowProps> = ({
    week,
    weekIdx,
    weekEventRows,
    today,
    dragStart,
    dragEnd,
    isDragging,
    cellRefs,
    getColumnPadding,
    getSafeDateKey,
    getEventsForDate,
    maxVisibleRows,
    tagHeight,
    tagSpacing,
    cellHeights,
    onEditEvent,
    onDeleteEvent,
    onEventClick,
    onDateClick,
    onDragStart,
    onDragEnter,
    onHiddenCountClick,
}) => {
    const pad = (n: number) => (n < 10 ? "0" + n : String(n));

    // 각 날짜별로 셀 높이에 맞춰 표시 가능한 행 수 계산
    const dateHeaderHeight = 48; // 날짜 헤더 높이 (top: 46px + 약간의 여백)
    const bottomPadding = 20; // 하단 여백 (+n개 표시 공간)
    
    const getMaxVisibleRowsForCell = (dateKey: string): number => {
        const cellHeight = cellHeights[dateKey] || 0;
        if (cellHeight === 0) return maxVisibleRows; // 높이를 아직 측정하지 못한 경우 기본값 사용
        
        // 셀 높이에서 헤더와 하단 여백을 제외한 사용 가능한 높이
        const availableHeight = Math.max(
            0,
            cellHeight - dateHeaderHeight - bottomPadding
        );
        
        if (availableHeight <= 0) return 0;
        
        // 태그 높이와 간격을 고려하여 표시 가능한 행 수 계산
        const rows = Math.floor(
            availableHeight / (tagHeight + tagSpacing)
        );
        
        return Math.max(0, rows);
    };

    // 각 날짜별로 셀 높이에 맞춰 표시 가능한 태그 계산
    const cellMaxVisibleRows = new Map<number, number>();
    
    week.forEach(({ date }, dayIdx) => {
        const dateKey = `${date.getFullYear()}-${pad(
            date.getMonth() + 1
        )}-${pad(date.getDate())}`;
        
        const cellMaxRows = getMaxVisibleRowsForCell(dateKey);
        cellMaxVisibleRows.set(dayIdx, cellMaxRows);
    });

    // 태그는 각 셀의 높이를 넘어가지 않는 범위에서만 표시
    const visibleSegments = weekEventRows.filter((segment) => {
        // 이 세그먼트가 포함된 모든 날짜를 확인
        for (let dayIdx = segment.startOffset; dayIdx < segment.startOffset + segment.duration; dayIdx++) {
            const dateKey = `${week[dayIdx].date.getFullYear()}-${pad(
                week[dayIdx].date.getMonth() + 1
            )}-${pad(week[dayIdx].date.getDate())}`;
            
            // 태그가 셀 높이를 넘어가면 숨김
            if (isTagOverflowing(segment.rowIndex, dateKey)) {
                return false;
            }
        }
        
        return true;
    });

    return (
        <div
            key={weekIdx}
            className="flex-1 grid grid-cols-7 border-b border-gray-200 relative overflow-hidden"
        >
            {/* 주 단위 이벤트 렌더링 */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ top: "46px" }}
            >
                {visibleSegments.map((segment) => {
                    const left = (segment.startOffset / 7) * 100;
                    const width = (segment.duration / 7) * 100;

                    const startDayDate = week[segment.startOffset]?.date;
                    const endDayDate =
                        week[
                            Math.min(
                                6,
                                segment.startOffset + segment.duration - 1
                            )
                        ]?.date;

                    if (!startDayDate || !endDayDate) return null;

                    const isEventStart =
                        segment.event.startDate ===
                        getSafeDateKey(startDayDate);
                    const isEventEnd =
                        segment.event.endDate === getSafeDateKey(endDayDate);

                    return (
                        <CalendarTag
                            key={`${segment.event.id}-${segment.startOffset}-${segment.rowIndex}`}
                            title={
                                isEventStart || segment.startOffset === 0
                                    ? segment.event.title
                                    : ""
                            }
                            variant={
                                segment.event.isHoliday ? "holiday" : "event"
                            }
                            color={segment.event.color}
                            isStart={isEventStart}
                            isEnd={isEventEnd}
                            left={`${left}%`}
                            width={`calc(${width}% - ${
                                isEventStart ? 8 : 0
                            }px - ${isEventEnd ? 8 : 0}px)`}
                            top={`${
                                segment.rowIndex * (tagHeight + tagSpacing)
                            }px`}
                            onEdit={
                                segment.event.isHoliday
                                    ? undefined
                                    : () => onEditEvent(segment.event)
                            }
                            onDelete={
                                segment.event.isHoliday
                                    ? undefined
                                    : () => onDeleteEvent(segment.event.id)
                            }
                            onClick={
                                segment.event.isHoliday
                                    ? undefined
                                    : (e) => onEventClick(segment.event, e)
                            }
                        />
                    );
                })}
            </div>

            {/* 각 날짜 셀 렌더링 */}
            {week.map(({ date, inMonth }, dayIdx) => {
                const dateKey = `${date.getFullYear()}-${pad(
                    date.getMonth() + 1
                )}-${pad(date.getDate())}`;

                const isToday =
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate();

                // 드래그 선택 범위 확인
                const isInDragRange =
                    dragStart &&
                    dragEnd &&
                    (() => {
                        const start = new Date(dragStart);
                        const end = new Date(dragEnd);
                        const current = new Date(dateKey);
                        const minDate = start < end ? start : end;
                        const maxDate = start < end ? end : start;
                        return current >= minDate && current <= maxDate;
                    })();

                const columnPadding = getColumnPadding(dayIdx);

                // 해당 날짜의 이벤트 가져오기
                const dayEvents = getEventsForDate(dateKey);

                // 해당 날짜에 해당하는 세그먼트 필터링
                const daySegments = weekEventRows.filter(
                    (segment) =>
                        segment.startOffset <= dayIdx &&
                        dayIdx < segment.startOffset + segment.duration
                );

                // 이 셀의 최대 표시 가능 행 수
                const cellMaxRows = cellMaxVisibleRows.get(dayIdx) ?? maxVisibleRows;

                // 실제로 표시되는 세그먼트 (visibleSegments에 포함된 것들)
                const visibleSegmentsForDay = visibleSegments.filter(
                    (seg) =>
                        seg.startOffset <= dayIdx &&
                        dayIdx < seg.startOffset + seg.duration
                );
                
                const visibleEventIds = new Set(
                    visibleSegmentsForDay.map((seg) => seg.event.id)
                );
                
                // 숨겨진 이벤트 개수 계산 (표시되지 않는 이벤트)
                // dayEvents에는 있지만 visibleSegments에는 없는 이벤트
                const hiddenCount = dayEvents.filter(
                    (event) => !visibleEventIds.has(event.id)
                ).length;

                return (
                    <DayCell
                        key={dayIdx}
                        date={date}
                        inMonth={inMonth}
                        dayIdx={dayIdx}
                        dateKey={dateKey}
                        isToday={isToday}
                        isInDragRange={!!isInDragRange}
                        columnPadding={columnPadding}
                        hiddenCount={hiddenCount}
                        maxVisibleRows={maxVisibleRows}
                        cellRefs={cellRefs}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                onDragStart(dateKey, e);
                            }
                        }}
                        onMouseEnter={() => {
                            if (isDragging && dragStart) {
                                onDragEnter(dateKey);
                            }
                        }}
                        onClick={(e) => {
                            if (!inMonth) return;
                            if (!isDragging && !dragStart) {
                                onDateClick(dateKey, e);
                            }
                        }}
                        onHiddenCountClick={() => {
                            const cellMaxRows = cellMaxVisibleRows.get(dayIdx) || maxVisibleRows;
                            onHiddenCountClick(dateKey, cellMaxRows);
                        }}
                    />
                );
            })}
        </div>
    );
};

export default WeekRow;
