const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 9L13.5 18L22.5 27" stroke="#d1d5dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDescription = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="white" />
  </svg>
);

interface CreationHeaderProps {
  onMenuClick?: () => void;
}

export default function CreationHeader({ onMenuClick }: CreationHeaderProps) {
  return (
    <header className="bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
      <div className="flex gap-1 items-center">
        {/* 모바일 햄버거 메뉴 */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors text-[#101828] mr-2"
        >
          <IconMenu />
        </button>
        <button className="hidden sm:block hover:bg-[#f3f4f6] rounded-lg transition-colors">
          <IconArrowLeft />
        </button>
        <h1 className="font-bold text-[18px] sm:text-[20px] md:text-[24px] text-[#030712] leading-[1.358] tracking-[-0.66px]">
          출장 보고서 작성
        </h1>
      </div>
      
      <div className="flex gap-2 md:gap-3 items-center">
        <button className="h-9 md:h-10 px-3 md:px-4 py-2 bg-[#f3f4f6] rounded-xl flex gap-1 items-center justify-center hover:bg-[#e5e7eb] transition-colors">
          <span className="font-medium text-[12px] md:text-[14px] text-[#4a5565] text-center leading-[1.5]">
            임시 저장
          </span>
        </button>
        <button className="h-9 md:h-10 px-3 md:px-4 py-2 bg-[#364153] rounded-xl flex gap-1 items-center justify-center hover:bg-[#1f2937] transition-colors">
          <IconDescription />
          <span className="hidden sm:inline font-medium text-[12px] md:text-[14px] text-white text-center leading-[1.5]">
            제출하기
          </span>
        </button>
      </div>
    </header>
  );
}

