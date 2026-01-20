import { CalendarEvent } from "../types";

/**
 * 월 그리드 생성
 */
export function generateMonthGrid(year: number, month: number) {
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

/**
 * 주 단위로 그리드 데이터 나누기
 */
export function splitIntoWeeks(
    grid: { date: Date; inMonth: boolean }[]
) {
    const result = [];
    for (let i = 0; i < grid.length; i += 7) {
        result.push(grid.slice(i, i + 7));
    }
    return result;
}

/**
 * 안전하게 날짜 키 생성
 */
export function getSafeDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * 주 단위 이벤트 행 계산 함수 (연속된 일정을 위해)
 */
export function getWeekEventRows(
    week: { date: Date; inMonth: boolean }[],
    sortedEvents: CalendarEvent[]
) {
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

    // 각 세그먼트에 rowIndex를 추가하여 반환
    return rows
        .map((row, rowIndex) =>
            row.map((segment) => ({ ...segment, rowIndex }))
        )
        .flat();
}

/**
 * 특정 날짜의 이벤트 목록 가져오기
 */
export function getEventsForDate(
    dateKey: string,
    sortedEvents: CalendarEvent[]
): CalendarEvent[] {
    return sortedEvents.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const current = new Date(dateKey);
        return current >= eventStart && current <= eventEnd;
    });
}

/**
 * 날짜 범위 포맷팅
 */
export function formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startStr = `${start.getMonth() + 1}월 ${start.getDate()}일`;
    const endStr = `${end.getMonth() + 1}월 ${end.getDate()}일`;

    if (startDate === endDate) {
        return `${startStr}`;
    }
    return `${startStr} ~ ${endStr}`;
}

/**
 * 컬럼 패딩 계산
 */
export function getColumnPadding(index: number): string {
    if (index === 0) return "pl-9 pr-4";
    if (index === 6) return "pl-4 pr-9";
    return "";
}

