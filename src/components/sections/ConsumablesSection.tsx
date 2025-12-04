import { useState } from 'react';
import SectionCard from '../ui/SectionCard';
import Select from '../ui/Select';

const IconCancel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="#d1d5dc" />
  </svg>
);

interface ConsumableEntry {
  id: number;
  name: string;
  quantity: string;
}

export default function ConsumablesSection() {
  const [consumables] = useState<ConsumableEntry[]>([
    { id: 1, name: '지퍼백', quantity: '30매' },
    { id: 2, name: '지퍼백', quantity: '30매' },
    { id: 3, name: '지퍼백', quantity: '30매' },
  ]);

  return (
    <SectionCard title="소모품 사용량">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-end">
          <Select label="품목명" placeholder="품목 선택" className="flex-1" />
          <div className="flex-1">
            <div className="bg-white border border-[#e5e7eb] rounded-xl h-12 flex items-center px-4">
              <input
                type="text"
                placeholder="예) 10kg 5개, 2L 10매"
                className="flex-1 outline-none text-[16px] placeholder:text-[#99a1af]"
              />
            </div>
          </div>
        </div>

        {/* 소모품 추가 버튼 */}
        <button className="h-12 bg-[#364153] rounded-xl flex items-center justify-center text-white font-medium text-[16px] hover:bg-[#1f2937] transition-colors">
          소모품 추가
        </button>

        {/* 저장된 소모품 목록 */}
        <div className="flex flex-col gap-4">
          <div className="h-px bg-[#e5e7eb]" />
          {consumables.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#f3f4f6] rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex gap-1.5 items-center">
                <span className="font-semibold text-[16px] text-[#101828] leading-[1.5]">
                  {item.name}
                </span>
                <span className="text-[15px] text-[#99a1af] leading-[1.467]">
                  {item.quantity}
                </span>
              </div>
              <button className="px-3 hover:opacity-70">
                <IconCancel />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

