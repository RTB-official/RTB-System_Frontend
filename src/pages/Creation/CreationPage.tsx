import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import CreationHeader from '../../components/CreationHeader';
import BasicInfoSection from '../../components/sections/BasicInfoSection';
import WorkerSection from '../../components/sections/WorkerSection';
import WorkLogSection from '../../components/sections/WorkLogSection';
import ExpenseSection from '../../components/sections/ExpenseSection';
import ConsumablesSection from '../../components/sections/ConsumablesSection';
import FileUploadSection from '../../components/sections/FileUploadSection';

export default function CreationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 데스크탑에서 고정, 모바일에서 슬라이드 */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-[239px] h-screen flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Header - 고정 */}
        <div className="sticky top-0 z-10 flex-shrink-0">
          <CreationHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>
        
        {/* Content Area - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 py-6 md:py-9">
          <div className="max-w-[817px] mx-auto flex flex-col gap-4 md:gap-6">
            {/* 기본 정보 */}
            <BasicInfoSection />
            
            {/* 작업자 */}
            <WorkerSection />
            
            {/* 출장 업무 일지 */}
            <WorkLogSection />
            
            {/* 경비 내역 */}
            <ExpenseSection />
            
            {/* 소모품 사용량 */}
            <ConsumablesSection />
            
            {/* 첨부파일 업로드 */}
            <FileUploadSection />
            
            {/* 결재 */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 md:p-7 overflow-hidden">
              <p className="text-[18px] md:text-[22px] font-semibold text-[#364153] leading-[1.364] tracking-[-0.43px]">
                결재
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

