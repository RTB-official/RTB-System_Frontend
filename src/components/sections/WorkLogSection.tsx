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

const IconTime = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#101828" />
  </svg>
);

const IconEdit = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#99a1af" />
  </svg>
);

const IconDelete = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#99a1af" />
  </svg>
);

const IconPeople = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#101828" />
  </svg>
);

interface WorkLogEntry {
  id: number;
  badge: string;
  duration: string;
  date: string;
  workers: string[];
  description: string;
}

const availableWorkers = ['김동민', '안재훈', '문채훈', '고두형'];
const regionFilters = ['전체 추가', '부산/창원', '양산/정관', '울산', '거제'];

export default function WorkLogSection() {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(['김동민', '안재훈']);
  const [workLogs] = useState<WorkLogEntry[]>([
    {
      id: 1,
      badge: '텍스트',
      duration: '4시간',
      date: '11/8 8:00~17:00',
      workers: ['홍길동', '홍길동', '홍길동', '홍길동', '홍길동', '홍길동', '홍길동'],
      description: '자택 → 공장 → 출장지',
    },
    {
      id: 2,
      badge: '텍스트',
      duration: '4시간',
      date: '11/8 8:00~17:00',
      workers: ['홍길동', '홍길동', '홍길동', '홍길동', '홍길동', '홍길동', '홍길동'],
      description: '자택 → 공장 → 출장지',
    },
  ]);

  return (
    <SectionCard title="출장 업무 일지">
      <div className="flex flex-col gap-5">
        {/* 입력 폼 */}
        <div className="flex flex-col gap-7">
          {/* 시작/마무리 시간 */}
          <div className="flex gap-3">
            <div className="flex-1 flex gap-2 items-end">
              <TextInput
                label="시작 시간"
                placeholder="연도. 월. 일."
                icon={<IconCalendar />}
                className="flex-1"
              />
              <div className="bg-white border border-[#e5e7eb] rounded-xl h-12 flex items-center px-3 w-[150px]">
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[16px] text-[#99a1af]">-- -- : --</span>
                  <IconTime />
                </div>
              </div>
            </div>
            <div className="flex-1 flex gap-2 items-end">
              <TextInput
                label="마무리 시간"
                placeholder="연도. 월. 일."
                icon={<IconCalendar />}
                className="flex-1"
              />
              <div className="bg-white border border-[#e5e7eb] rounded-xl h-12 flex items-center px-3 w-[150px]">
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[16px] text-[#99a1af]">-- -- : --</span>
                  <IconTime />
                </div>
              </div>
            </div>
          </div>

          {/* 작업 분류 */}
          <Select label="작업 분류" placeholder="작업" />

          {/* 업무내용 */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[15px] text-[#101828] leading-[1.467]">
              업무내용
            </label>
            <div className="bg-white border border-[#e5e7eb] rounded-xl h-[86px] p-3 overflow-hidden">
              <textarea
                placeholder="수행한 업무 내용을 자세히 기록해주세요 (영어 단어 자동완성 지원)"
                className="w-full h-full resize-none outline-none text-[16px] text-[#101828] placeholder:text-[#99a1af]"
              />
            </div>
            <label className="flex gap-1 items-center text-[14px] text-[#6a7282] font-medium">
              <input type="checkbox" className="w-5 h-5 rounded" />
              점심 안 먹고 진행
            </label>
          </div>

          {/* 참여 인원 선택 */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[15px] text-[#101828] leading-[1.467]">
              참여 인원 선택
            </label>
            <div className="flex flex-col gap-2">
              {/* 작업자 선택 박스 */}
              <div className="border border-[#e5e7eb] rounded-2xl p-4">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[14px] text-[#6a7282] leading-[1.429]">
                    작업자 선택
                  </p>
                  <div className="flex gap-2 flex-wrap">
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
              </div>

              {/* 지역 필터 */}
              <div className="flex gap-2">
                {regionFilters.map((filter) => (
                  <Chip key={filter} variant="default" size="sm">
                    {filter}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 선택된 작업자 */}
            <div className="border border-[#2b7fff] rounded-2xl p-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 13.475L4.025 10L2.8375 11.175L7.5 15.8375L17.5 5.8375L16.325 4.6625L7.5 13.475Z" fill="#2b7fff" />
                  </svg>
                  <span className="font-medium text-[15px] text-[#101828] leading-[1.467]">
                    선택된 작업자
                  </span>
                  <span className="font-medium text-[14px] text-[#99a1af] leading-[1.429]">
                    {selectedWorkers.length}명
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedWorkers.map((worker) => (
                    <Chip
                      key={worker}
                      variant="tag"
                      onRemove={() => setSelectedWorkers(prev => prev.filter(w => w !== worker))}
                    >
                      {worker}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 일지 저장 버튼 */}
        <button className="h-12 bg-[#364153] rounded-xl flex items-center justify-center text-white font-medium text-[16px] hover:bg-[#1f2937] transition-colors">
          일지 저장
        </button>

        {/* 저장된 일지 목록 */}
        <div className="flex flex-col gap-4">
          <div className="h-px bg-[#e5e7eb]" />
          {workLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-7 px-2 rounded-lg border border-[#00a6f4]/40 flex items-center">
                    <span className="text-[13px] text-[#00a6f4] font-medium">{log.badge}</span>
                  </div>
                  <span className="font-medium text-[16px] text-[#101828]">{log.duration}</span>
                </div>
                <div className="flex gap-6">
                  <button className="hover:opacity-70"><IconEdit /></button>
                  <button className="hover:opacity-70"><IconDelete /></button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <IconCalendar />
                  <span className="font-medium text-[16px] text-[#101828]">{log.date}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <IconPeople />
                  <span className="font-medium text-[16px] text-[#101828]">
                    인원 : {log.workers.join(', ')} ({log.workers.length}명)
                  </span>
                </div>
              </div>
              <div className="h-px bg-[#e5e7eb]" />
              <p className="text-[16px] text-[#101828] leading-[1.625]">{log.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

