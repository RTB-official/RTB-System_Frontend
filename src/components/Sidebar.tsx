import { useState } from 'react';

// 아이콘 컴포넌트들
const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor" />
  </svg>
);

const IconDescription = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
  </svg>
);

const IconAssessment = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
  </svg>
);

const IconPayment = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor" />
  </svg>
);

const IconBeachAccess = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.127 14.56L6.43799 21.24L2.75799 17.56L9.43799 10.88C8.89799 8.22 9.65799 5.36 11.537 3.48C14.347 0.67 18.657 0.45 21.707 2.89L16.557 8.04L17.967 9.45L23.117 4.3C25.567 7.35 25.337 11.66 22.527 14.47C20.647 16.35 17.787 17.11 15.127 16.57L13.127 14.56Z" fill="currentColor" />
  </svg>
);

const IconPeople = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
  </svg>
);

const IconNotifications = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
);

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('출장 보고서');

  const menuItems: MenuItem[] = [
    { icon: <IconHome />, label: '대시보드' },
    { icon: <IconDescription />, label: '출장 보고서', active: true },
    { icon: <IconAssessment />, label: '워크로드' },
    { icon: <IconPayment />, label: '지출 관리' },
    { icon: <IconBeachAccess />, label: '휴가 관리' },
    { icon: <IconPeople />, label: '구성원 관리' },
  ];

  return (
    <aside className="w-[239px] h-full bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col">
      <div className="flex flex-col gap-6 px-4 py-5">
        {/* Logo & Close Button */}
        <div className="flex gap-2 items-center justify-between p-2">
          <div className="flex gap-2 items-center">
            <img 
              src="/images/RTBlogo.png" 
              alt="RTB 로고" 
              className="h-10 w-auto object-contain flex-shrink-0"
            />
            <p className="font-semibold text-[14px] text-[#101828] leading-[1.5] whitespace-nowrap">
              RTB 통합 관리 시스템
            </p>
          </div>
          {/* 모바일 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-[#e5e7eb] rounded-lg transition-colors text-[#101828]"
          >
            <IconClose />
          </button>
        </div>

        {/* User Section */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center p-2">
            <div className="w-7 h-7 rounded-full bg-[#101828]" />
            <p className="font-semibold text-[16px] text-[#101828] leading-[1.5]">
              user name
            </p>
          </div>
          
          {/* Notifications */}
          <div className="flex gap-6 items-center p-3">
            <div className="flex gap-3 items-center w-[162px] text-[#101828]">
              <IconNotifications />
              <p className="font-medium text-[16px] leading-[1.5]">알림</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e7eb] rounded-full" />

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`flex gap-6 items-center p-3 rounded-xl transition-colors ${
                activeItem === item.label
                  ? 'bg-[#364153] text-white'
                  : 'text-[#101828] hover:bg-[#e5e7eb]'
              }`}
            >
              <div className="flex gap-3 items-center w-[162px]">
                {item.icon}
                <p className="font-medium text-[16px] leading-[1.5]">{item.label}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

