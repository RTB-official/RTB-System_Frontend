import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import ExpenseHeader from './ExpenseHeader'
import MileageCard from './components/MileageCard'
import ExpenseFormCard from './components/ExpenseFormCard'
import ExpenseListItem from './components/ExpenseListItem'

export default function PersonalExpensePage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const preselectedDate = params.get('date') || null

  const [leftItems, setLeftItems] = useState<any[]>([])
  const [rightItems, setRightItems] = useState<any[]>([])

  return (
    <div className="flex h-screen bg-[#f4f5f7]">
      <div className="fixed inset-y-0 left-0 z-30 w-[239px]">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[239px] p-3">
        <div className="w-full px-6">
          <ExpenseHeader year="2025년" month="11월" />
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-700">조회 기간</span>
              <select className="border rounded-md px-4 py-2 text-base bg-white">
                <option>2025년</option>
              </select>
              <select className="border rounded-md px-4 py-2 text-base bg-white">
                <option>11월</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
            <div>
              <MileageCard initialDate={preselectedDate || undefined} onAdd={(item) => setLeftItems(prev => [item, ...prev])} />
            </div>
            <div>
              <ExpenseFormCard initialDate={preselectedDate || undefined} onAdd={(item) => setRightItems(prev => [item, ...prev])} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div>
              {leftItems.length === 0 ? (
                <div className="text-gray-400 py-8 text-center rounded border border-dashed border-gray-100">
                  등록된 마일리지 내역이 없습니다.
                </div>
              ) : (
                leftItems.map((it) => (
                  <ExpenseListItem key={it.id} date={it.date || ''} tag={'개인'} desc={it.note || ''} amount={`${it.distance || 0}km`} tagColor="#3b82f6" />
                ))
              )}
            </div>

            <div>
              {rightItems.length === 0 ? (
                <div className="text-gray-400 py-8 text-center rounded border border-dashed border-gray-100">
                  등록된 지출 내역이 없습니다.
                </div>
              ) : (
                rightItems.map((it) => (
                  <ExpenseListItem
                    key={it.id}
                    date={it.date || ''}
                    tag={it.type || '기타'}
                    desc={it.detail || ''}
                    amount={`${it.amount || '0'}원`}
                    tagColor={it.type === '교통비' ? '#fb923c' : '#94a3b8'}
                    img={it.img}
                  />
                ))
              )}
            </div>
          </div>

          {/* spacer removed to reduce bottom empty space */}

          {/* submit bar */}
          <div className="fixed bottom-6 left-[239px] right-6">
            <button
              onClick={() => alert('제출 처리: ' + (leftItems.length + rightItems.length) + '개')}
              className="w-full bg-[#364153] text-white rounded-full py-3 text-center font-medium"
            >
              모두 제출 ({leftItems.length + rightItems.length}개)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
