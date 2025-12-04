import { useState } from 'react';
import SectionCard from '../ui/SectionCard';
import Chip from '../ui/Chip';

interface WorkerGroup {
  title: string;
  workers: string[];
}

const workerGroups: WorkerGroup[] = [
  { title: '부장', workers: ['김춘근', '안재훈', '온권태', '정영철'] },
  { title: '차장', workers: ['이효익', '정상민', '김동민', '손재진', '우상윤', '성기형', '류성관'] },
  { title: '대리', workers: ['이종훈'] },
  { title: '주임', workers: ['박영성', '문채훈', '김민규', '김상민'] },
  { title: '공무팀', workers: ['김영', '김현지', '김희규', '고두형', '조용남', '김지연', '박민욱', '정외철'] },
];

export default function WorkerSection() {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(['고두형', '박민욱']);

  const toggleWorker = (worker: string) => {
    setSelectedWorkers(prev => 
      prev.includes(worker) 
        ? prev.filter(w => w !== worker)
        : [...prev, worker]
    );
  };

  const removeWorker = (worker: string) => {
    setSelectedWorkers(prev => prev.filter(w => w !== worker));
  };

  return (
    <SectionCard title="작업자">
      <div className="flex flex-col gap-3">
        {workerGroups.map((group) => (
          <div 
            key={group.title} 
            className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2"
          >
            <p className="font-medium text-[15px] text-[#101828] leading-[1.467]">
              {group.title}
            </p>
            <div className="flex gap-2 flex-wrap">
              {group.workers.map((worker) => (
                <Chip
                  key={worker}
                  variant={selectedWorkers.includes(worker) ? 'selected' : 'default'}
                  onClick={() => toggleWorker(worker)}
                >
                  {worker}
                </Chip>
              ))}
            </div>
          </div>
        ))}

        {/* 선택된 작업자 */}
        <div className="py-4 flex flex-col gap-2">
          <div className="flex gap-1.5 items-center">
            <p className="font-medium text-[15px] text-[#101828] leading-[1.467]">
              선택된 작업자
            </p>
            <p className="font-medium text-[14px] text-[#99a1af] leading-[1.429]">
              {selectedWorkers.length}명
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedWorkers.map((worker) => (
              <Chip
                key={worker}
                variant="tag"
                onRemove={() => removeWorker(worker)}
              >
                {worker}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

