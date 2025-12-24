import React from 'react'
import EventForm from './EventForm'

export default function EventModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[540px] max-w-full p-6 z-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">일정 추가</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">닫기</button>
        </div>

        <EventForm onClose={onClose} />
      </div>
    </div>
  )
}


