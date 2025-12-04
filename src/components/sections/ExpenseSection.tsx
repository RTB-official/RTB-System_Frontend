import { useState } from 'react';
import SectionCard from '../ui/SectionCard';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Chip from '../ui/Chip';

const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="#101828" />
  </svg>
);

const IconCancel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="#d1d5dc" />
  </svg>
);

const availableWorkers = ['김동민', '안재훈', '문채훈', '고두형'];

interface ExpenseEntry {
  id: number;
  badge: string;
  date: string;
  amount: string;
  workers: string;
}

export default function ExpenseSection() {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(['김동민', '안재훈']);
  const [expenses] = useState<ExpenseEntry[]>([
    { id: 1, badge: '텍스트', date: '2025년 11월 20일', amount: '₩999,999', workers: '홍길동, 홍길동, 홍길동, 홍길동, 홍길동, 홍길동, 홍길동' },
    { id: 2, badge: '텍스트', date: '2025년 11월 20일', amount: '₩999,999', workers: '홍길동, 홍길동, 홍길동, 홍길동, 홍길동, 홍길동, 홍길동' },
  ]);

  return (
    <SectionCard 
      title="경비 내역"
      headerContent={
        <div className="flex flex-col items-end">
          <span className="font-medium text-[14px] text-[#99a1af] leading-[1.429]">총 경비 (9개)</span>
          <span className="font-semibold text-[20px] text-[#364153] leading-[1.4] tracking-[-0.24px]">₩999,999원</span>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-7">
          {/* 날짜 */}
          <TextInput
            label="날짜"
            placeholder="연도. 월. 일."
            icon={<IconCalendar />}
          />

          {/* 항목, 금액 */}
          <div className="flex gap-3">
            <Select label="항목" placeholder="항목 선택" className="flex-1" />
            <TextInput label="금액" placeholder="금액 입력" required className="flex-1" />
          </div>

          {/* 인원 및 세부 내용 */}
          <div className="border border-[#e5e7eb] rounded-xl p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-[14px] text-[#6a7282] leading-[1.429]">
                인원 및 세부 내용
              </p>
              <div className="flex gap-2 flex-wrap">
                <Chip variant="gray">모두 추가</Chip>
                {availableWorkers.map((worker) => (
                  <Chip
                    key={worker}
                    variant={selectedWorkers.includes(worker) ? 'selected' : 'default'}
                    onClick={() => setSelectedWorkers(prev =>
                      prev.includes(worker)
                        ? prev.filter(w => w !== worker)
                        : [...prev, worker]
                    )}
                  >
                    {worker}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-xl h-12 flex items-center px-4">
              <input
                type="text"
                placeholder="세부 내용 입력"
                className="flex-1 outline-none text-[16px] placeholder:text-[#99a1af]"
              />
            </div>
          </div>
        </div>

        {/* 경비 추가 버튼 */}
        <button className="h-12 bg-[#364153] rounded-xl flex items-center justify-center text-white font-medium text-[16px] hover:bg-[#1f2937] transition-colors">
          경비 추가
        </button>

        {/* 저장된 경비 목록 */}
        <div className="flex flex-col gap-4">
          <div className="h-px bg-[#e5e7eb]" />
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="h-7 px-2 rounded-lg border border-[#00a6f4]/40 flex items-center">
                    <span className="text-[13px] text-[#00a6f4] font-medium">{expense.badge}</span>
                  </div>
                  <span className="text-[15px] text-[#99a1af]">{expense.date}</span>
                </div>
                <button className="hover:opacity-70"><IconCancel /></button>
              </div>
              <p className="font-semibold text-[22px] text-[#101828] leading-[1.364] tracking-[-0.43px]">
                {expense.amount}
              </p>
              <p className="text-[16px] text-[#101828] leading-[1.5]">{expense.workers}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

