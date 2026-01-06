import React from 'react'
import EventForm from './EventForm'
import BaseModal from './ui/BaseModal'
import Button from './common/Button'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
  initialEndDate?: string
  onSave?: (data: {
    title: string
    startDate: string
    startTime?: string
    endDate: string
    endTime?: string
    allDay: boolean
  }) => void
}

export default function EventModal({ isOpen, onClose, initialDate, initialEndDate, onSave }: EventModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 추가"
      maxWidth="max-w-[640px]"
    >
      <EventForm onClose={onClose} initialDate={initialDate} initialEndDate={initialEndDate} onSave={onSave} />
    </BaseModal>
  )
}


