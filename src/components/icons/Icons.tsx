import React from 'react'

export const IconRTBLogo = (props: { className?: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" fill="#111827" />
    <path d="M7 8H17" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12H13" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconCalendar = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#374151" strokeWidth="1.6" fill="none" />
    <path d="M16 2v4M8 2v4" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10h1M11 10h1M15 10h1M7 14h1M11 14h1M15 14h1" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconUpload = (props: { className?: string }) => (
  // replaced with parasol (umbrella) for vacation
  <svg className={props.className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 3C7.6 3 4 6 3 9.5 4.6 9.2 7 8.5 12 8.5s7.4.7 9 1C20 6 16.4 3 12 3z" fill="#FCEFCF" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10c1-1 3-2 8-2s7 1 8 2" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.5v7" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20s0-1.5 2-1.5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconPayment = (props: { className?: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
    <rect x="3.5" y="8.5" width="6" height="2" rx="0.5" fill="#9CA3AF" />
  </svg>
)

export const IconCardAlt = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#ffffff" stroke="#374151" strokeWidth="1.4" />
    <rect x="3.5" y="7.5" width="16" height="2.8" rx="1" fill="#dfeafc" />
    <rect x="3.5" y="11.5" width="6" height="1.6" rx="0.8" fill="#c2d4f8" />
  </svg>
)

export const IconCar = (props: { className?: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* improved car side profile */}
    <path d="M2.5 13.5C3 11.5 4.2 9.8 6 9.3h9c1.8.5 3 2.2 3.5 4.2l.5 2H20" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 13.5h13" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9.3c1-.7 2.5-1 4-1s3 .3 4 1" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="6.2" y="8" width="4.2" height="2.2" rx="0.4" fill="#E6EEF8" stroke="#9CA3AF" strokeWidth="0.8"/>
    <rect x="13.6" y="8" width="3" height="2.2" rx="0.4" fill="#E6EEF8" stroke="#9CA3AF" strokeWidth="0.8"/>
    <circle cx="7.2" cy="17.2" r="1.4" fill="#111827"/>
    <circle cx="16.8" cy="17.2" r="1.4" fill="#111827"/>
    <path d="M3 15.5h2" stroke="#111827" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M19 15.5h2" stroke="#111827" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)


