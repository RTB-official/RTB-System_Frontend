import React from "react";
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

const pad = (n: number) => (n < 10 ? "0" + n : String(n));

const WeekRow: React.FC<WeekRowProps> = ({
    week,
    weekEventRows,
    today,
    dragStart,
    dragEnd,
    isDragging,
    cellRefs,
    getColumnPadding,
    getSafeDateKey,
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
    const TAG_LAYER_TOP = 54; // 날짜 숫자(30px) + 상단 패딩(12px) + 간격(10px) = 52px (여유 2px)
    const HIDDEN_COUNT_HEIGHT = 24;

    // 각 날짜별로 보여줄 태그와 숨길 태그 계산
    const dateTagInfo = new Map<
        string,
        { visibleSegments: WeekEventSegment[]; hiddenCount: number }
    >();

    week.forEach(({ date }, dayIdx) => {
        const dateKey = `${date.getFullYear()}-${pad(
            date.getMonth() + 1
        )}-${pad(date.getDate())}`;

        const cellHeight = cellHeights[dateKey] || 0;

        // 해당 날짜에 해당하는 세그먼트 필터링
        const daySegments = weekEventRows
            .filter(
                (seg) =>
                    seg.startOffset <= dayIdx &&
                    dayIdx < seg.startOffset + seg.duration
            )
            .sort((a, b) => a.rowIndex - b.rowIndex);

        // 셀 높이가 측정되지 않았으면 모든 태그 표시
        if (cellHeight === 0) {
            dateTagInfo.set(dateKey, {
                visibleSegments: daySegments,
                hiddenCount: 0,
            });
            return;
        }

        // 태그가 하나도 없으면 처리할 필요 없음
        if (daySegments.length === 0) {
            dateTagInfo.set(dateKey, {
                visibleSegments: [],
                hiddenCount: 0,
            });
            return;
        }

        // cellHeight는 ResizeObserver로 측정된 셀의 실제 높이 (content box)
        // 태그 컨테이너는 top: TAG_LAYER_TOP (54px)에서 시작

        // 태그가 들어갈 수 있는 공간 (태그 컨테이너 시작점부터 셀 하단까지)
        const availableHeight = cellHeight - TAG_LAYER_TOP;

        // availableHeight가 0 이하이면 태그를 표시할 수 없음
        if (availableHeight <= 0) {
            dateTagInfo.set(dateKey, {
                visibleSegments: [],
                hiddenCount: daySegments.length,
            });
            return;
        }

        // 각 태그의 위치 계산 (태그 컨테이너 기준 - 0부터 시작)
        // 태그는 컨테이너 내부에서 rowIndex * (tagHeight + tagSpacing)에 위치
        const tagPositions = daySegments.map((seg) => {
            const tagTop = seg.rowIndex * (tagHeight + tagSpacing);
            const tagBottom = tagTop + tagHeight;
            return { seg, tagTop, tagBottom };
        });

        // 마지막 태그의 하단 위치
        const lastTagBottom = tagPositions.length > 0
            ? Math.max(...tagPositions.map(p => p.tagBottom))
            : 0;

        // +N개 공간을 확보한 최대 높이
        const maxVisibleHeightWithHidden = availableHeight - HIDDEN_COUNT_HEIGHT;

        // 모든 태그가 availableHeight 안에 들어가는지 확인
        if (lastTagBottom <= availableHeight) {
            // 모든 태그가 들어가지만, +N개 공간을 미리 확보하지 않음
            dateTagInfo.set(dateKey, {
                visibleSegments: daySegments,
                hiddenCount: 0,
            });
            return;
        }

        // 태그가 넘어가는 경우, +N개 공간(24px)을 확보하고 보여줄 태그 계산
        // 태그가 들어갈 수 있는 최대 높이 (태그 컨테이너 기준)
        const maxVisibleHeight = maxVisibleHeightWithHidden;

        // 보여줄 수 있는 태그들 선택 (완전히 들어가는 것만)
        // 태그의 하단이 maxVisibleHeight 이하이면 완전히 보임
        const visibleSegments: WeekEventSegment[] = [];
        for (const { seg, tagBottom } of tagPositions) {
            if (tagBottom <= maxVisibleHeight) {
                visibleSegments.push(seg);
            } else {
                // 태그가 잘리면 더 이상 추가하지 않음
                break;
            }
        }

        // 숨겨진 태그 개수 = 전체 세그먼트 수 - 보이는 세그먼트 수
        const hiddenCount = daySegments.length - visibleSegments.length;

        dateTagInfo.set(dateKey, {
            visibleSegments,
            hiddenCount,
        });
    });

    return (
        <div className="flex-1 grid grid-cols-7 border-b border-gray-200 relative">
            {/* 날짜 셀 */}
            {week.map(({ date, inMonth }, dayIdx) => {
                const dateKey = `${date.getFullYear()}-${pad(
                    date.getMonth() + 1
                )}-${pad(date.getDate())}`;

                const isToday =
                    date.toDateString() === today.toDateString();

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

                const tagInfo = dateTagInfo.get(dateKey);
                const cellHeight = cellHeights[dateKey] || 0;

                return (
                    <DayCell
                        key={dayIdx}
                        date={date}
                        inMonth={inMonth}
                        dayIdx={dayIdx}
                        dateKey={dateKey}
                        isToday={isToday}
                        isInDragRange={!!isInDragRange}
                        columnPadding={getColumnPadding(dayIdx)}
                        hiddenCount={tagInfo?.hiddenCount ?? 0}
                        onHiddenCountClick={() =>
                            onHiddenCountClick(dateKey, tagInfo?.visibleSegments.length ?? 0)
                        }
                        cellRefs={cellRefs}
                        tagHeight={tagHeight}
                        tagSpacing={tagSpacing}
                        tagLayerTop={TAG_LAYER_TOP}
                        visibleSegments={
                            cellHeight > 0
                                ? weekEventRows.filter((segment) => {
                                    const segmentEnd = segment.startOffset + segment.duration;
                                    const overlaps = segment.startOffset <= dayIdx && dayIdx < segmentEnd;
                                    if (!overlaps) return false;
                                    return tagInfo?.visibleSegments.some(
                                        (s) => s.event.id === segment.event.id
                                    );
                                })
                                : weekEventRows.filter(
                                    (seg) =>
                                        seg.startOffset <= dayIdx &&
                                        dayIdx < seg.startOffset + seg.duration
                                )
                        }
                        week={week}
                        getSafeDateKey={getSafeDateKey}
                        onEditEvent={onEditEvent}
                        onDeleteEvent={onDeleteEvent}
                        onEventClick={onEventClick}
                        onMouseDown={(e) => onDragStart(dateKey, e)}
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
                    />
                );
            })}
        </div>
    );
};

export default WeekRow;
