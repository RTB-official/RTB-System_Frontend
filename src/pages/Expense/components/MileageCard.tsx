import React from 'react'
import { IconCar, IconCalendar } from '../../../components/icons/Icons'
import DatePickerPanel from '../../../components/DatePickerPanel'

export default function MileageCard({ onAdd, initialDate }: { onAdd?: (item: any) => void, initialDate?: string }) {
  const [date, setDate] = React.useState(initialDate || '')
  React.useEffect(() => {
    if (initialDate) setDate(initialDate)
  }, [initialDate])
  const [from, setFrom] = React.useState('자택')
  const [to, setTo] = React.useState('공장')
  const [distance, setDistance] = React.useState('')
  const [note, setNote] = React.useState('')

  const chips = ['자택', '공장', '출장지']
  const hiddenDateRef = React.useRef<HTMLInputElement | null>(null)
  const [showPicker, setShowPicker] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const costPerKm = 250
  const cost = Number(distance || 0) * costPerKm
  const formattedCost = cost.toLocaleString('ko-KR') + '원'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col min-h-[500px]">
      <div className="flex items-center gap-3 mb-3">
        <IconCar className="w-8 h-8" />
        <h4 className="font-semibold text-gray-800 text-lg">개인 차량 마일리지</h4>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-[2] space-y-4">
          <div>
            <label className="text-sm text-gray-600">날짜</label>
            <div className="mt-2 relative">
              <input
                value={date}
                onChange={(e)=>setDate(e.target.value)}
                placeholder="연도. 월. 일"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-base pr-12"
              />
              <input
                ref={hiddenDateRef}
                type="date"
                onChange={(e)=>setDate(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPicker((s)=>!s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="달력 열기"
              >
                <IconCalendar className="w-7 h-7" />
              </button>
              {showPicker && (
                <div ref={wrapperRef} className="absolute z-40 right-0 mt-2">
                  <DatePickerPanel
                    selected={date || null}
                    onSelect={(d)=>{ setDate(d); setShowPicker(false) }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">출발지</label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {chips.map((c)=>(
                  <button key={c} onClick={()=>setFrom(c)} className={`px-4 py-2 rounded-md text-base border ${from===c ? 'bg-[#364153] text-white border-[#364153]' : 'bg-white text-gray-700 border-gray-200'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">도착지</label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {chips.map((c)=>(
                  <button key={c} onClick={()=>setTo(c)} className={`px-4 py-2 rounded-md text-base border ${to===c ? 'bg-[#364153] text-white border-[#364153]' : 'bg-white text-gray-700 border-gray-200'}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">거리(km)</label>
            <input value={distance} onChange={(e)=>setDistance(e.target.value)} placeholder="예) 120" className="w-full mt-2 border border-gray-200 rounded-md px-4 py-3 text-base" />
            <div className="mt-2 flex gap-3">
              <button onClick={()=>setDistance(String(Number(distance||0)+1))} className="text-sm px-3 py-2 bg-gray-100 rounded">+1km</button>
              <button onClick={()=>setDistance(String(Number(distance||0)+5))} className="text-sm px-3 py-2 bg-gray-100 rounded">+5km</button>
              <button onClick={()=>setDistance(String(Number(distance||0)+10))} className="text-sm px-3 py-2 bg-gray-100 rounded">+10km</button>
            </div>
          </div>
        </div>

        <div className="flex-[1] space-y-3">
          <div>
            <label className="text-sm text-gray-600">상세내용</label>
            <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="상세내용" className="w-full mt-2 border border-gray-200 rounded-md px-4 py-3 text-base" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base text-gray-500">마일리지</div>
          <div className="text-base font-semibold">{formattedCost}</div>
        </div>
        <button onClick={()=>{
          if(onAdd) onAdd({ id: Date.now(), date, from, to, distance, note, cost })
        }} className="w-full bg-[#eef7ff] text-[#3b82f6] py-4 rounded-md text-base">추가</button>
      </div>
    </div>
  )
}


