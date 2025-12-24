import React from 'react'

export default function EventForm({ onClose }: { onClose?: () => void }) {
  const [title, setTitle] = React.useState('')
  const [allDay, setAllDay] = React.useState(false)

  const pad = (n: number) => (n < 10 ? '0' + n : String(n))

  const hourOptions = Array.from({ length: 25 }, (_, i) => pad(i)) // 00 ~ 24
  const minuteOptions = ['00', '30']

  const [startDate, setStartDate] = React.useState<string>('')
  const [startHour, setStartHour] = React.useState<string>('09')
  const [startMinute, setStartMinute] = React.useState<string>('00')

  const [endDate, setEndDate] = React.useState<string>('')
  const [endHour, setEndHour] = React.useState<string>('18')
  const [endMinute, setEndMinute] = React.useState<string>('00')

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">일정 제목</label>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2 items-center">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="min-w-0 border border-gray-200 rounded-md px-3 py-2" placeholder="일정 제목을 입력해주세요" />
          <div />{/* placeholder to keep grid consistent with time rows */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allDay} onChange={(e)=>setAllDay(e.target.checked)} />
          <span className="text-sm text-gray-600">하루종일</span>
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">시작</label>
          <div className="mt-2 flex gap-1 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e)=>setStartDate(e.target.value)}
              className="w-[136px] min-w-0 border border-gray-200 rounded-md px-1 py-1 text-sm h-8"
            />
            {!allDay && (
              <div className="flex gap-1 items-center">
                <select value={startHour} onChange={(e)=>setStartHour(e.target.value)} className="w-[72px] text-sm border border-gray-200 rounded-md px-1 py-1 h-8">
                  {hourOptions.map(h=> <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={startMinute} onChange={(e)=>setStartMinute(e.target.value)} className="w-[72px] text-sm border border-gray-200 rounded-md px-1 py-1 h-8">
                  {minuteOptions.map(m=> <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">종료</label>
          <div className="mt-2 flex gap-1 items-center">
            <input
              type="date"
              value={endDate}
              onChange={(e)=>setEndDate(e.target.value)}
              className="w-[136px] min-w-0 border border-gray-200 rounded-md px-1 py-1 text-sm h-8"
            />
            {!allDay && (
              <div className="flex gap-1 items-center">
                <select value={endHour} onChange={(e)=>setEndHour(e.target.value)} className="w-[72px] text-sm border border-gray-200 rounded-md px-1 py-1 h-8">
                  {hourOptions.map(h=> <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={endMinute} onChange={(e)=>setEndMinute(e.target.value)} className="w-[72px] text-sm border border-gray-200 rounded-md px-1 py-1 h-8">
                  {minuteOptions.map(m=> <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">참가자</label>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2 items-center">
          <input className="min-w-0 border border-gray-200 rounded-md px-3 py-2" placeholder="참가자" />
          <div />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-3 py-1 rounded-md border bg-white">취소</button>
        <button className="px-3 py-1 rounded-md bg-blue-600 text-white">저장</button>
      </div>
    </div>
  )
}


