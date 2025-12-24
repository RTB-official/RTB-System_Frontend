import React from 'react'
import { IconCardAlt, IconUpload, IconCalendar } from '../../../components/icons/Icons'
import DatePickerPanel from '../../../components/DatePickerPanel'

export default function ExpenseFormCard({ onAdd, initialDate }: { onAdd?: (item: any) => void, initialDate?: string }) {
  const [date, setDate] = React.useState(initialDate || '')
  React.useEffect(() => {
    if (initialDate) setDate(initialDate)
  }, [initialDate])
  const hiddenDateRef = React.useRef<HTMLInputElement | null>(null)
  const [showPicker, setShowPicker] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const [type, setType] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [detail, setDetail] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col min-h-[500px]">
      <div className="flex items-center gap-3 mb-3">
        <IconCardAlt className="w-8 h-8" />
        <h4 className="font-semibold text-gray-800 text-lg">개인 카드/현금 지출내역</h4>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-[2] space-y-6">
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
                <IconCalendar className="w-6 h-6" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">유형</label>
              <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full mt-2 border border-gray-200 rounded-md px-4 py-3 text-base">
                <option value="">유형 선택</option>
                <option value="교통비">교통비</option>
                <option value="식대">식대</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">금액(원)</label>
              <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="예) 26000" className="w-full mt-2 border border-gray-200 rounded-md px-4 py-3 text-base" />
            </div>
          </div>
        </div>

        <div className="flex-[1] space-y-6">
          <div>
            <label className="text-sm text-gray-600">상세내역</label>
            <input value={detail} onChange={(e)=>setDetail(e.target.value)} placeholder="상세내역" className="w-full mt-2 border border-gray-200 rounded-md px-4 py-3 text-base" />
          </div>

          <div>
            <label className="text-sm text-gray-600">영수증 첨부</label>
            <div
              className="mt-2 border-dashed border-2 border-gray-200 rounded-lg p-6 text-center text-sm flex flex-col items-center justify-center gap-3 cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded" />
              ) : (
                <>
                  <IconUpload className="w-8 h-8 text-gray-400" />
                  <div className="text-gray-400">파일 업로드</div>
                  <div className="text-xs text-gray-300">Maximum 300 MB file size</div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                setFile(f)
                if (f) {
                  const url = URL.createObjectURL(f)
                  setPreview(url)
                } else {
                  setPreview(null)
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={()=>{
          if(onAdd) onAdd({ id: Date.now(), date, type, amount, detail, img: preview })
          // clear form
          setType('')
          setAmount('')
          setDetail('')
          setFile(null)
          setPreview(null)
        }} className="w-full bg-[#eef7ff] text-[#3b82f6] py-4 rounded-md text-base">추가</button>
      </div>
    </div>
  )
}


