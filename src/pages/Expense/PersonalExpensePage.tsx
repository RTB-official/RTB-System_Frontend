import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// 아이콘 컴포넌트
const IconChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor" />
  </svg>
);

const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor" />
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM9 12H7V10H9V12ZM13 12H11V10H13V12ZM17 12H15V10H17V12ZM9 16H7V14H9V16ZM13 16H11V14H13V16ZM17 16H15V14H17V16Z" fill="currentColor" />
  </svg>
);

const IconCar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="currentColor" />
  </svg>
);

const IconPayment = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor" />
  </svg>
);

const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
);

// 출발지/도착지 옵션
const locationOptions = ['자택', '공장', '출장지'];

// 샘플 마일리지 기록 (status: 'pending' | 'submitted')
const mileageRecords = [
  { id: 1, date: '2025년 11월 20일', amount: '999,999원', distance: '99km', from: '출장지', to: '공장', status: 'pending' },
  { id: 2, date: '2025년 11월 20일', amount: '999,999원', distance: '99km', from: '출장지', to: '공장', status: 'submitted' },
  { id: 3, date: '2025년 11월 20일', amount: '999,999원', distance: '99km', from: '출장지', to: '공장', status: 'submitted' },
];

// 샘플 지출 기록 (status: 'pending' | 'submitted')
const expenseRecords = [
  { id: 1, date: '2025년 11월 20일', type: '간식', amount: '999,999원', image: '/images/RTBlogo.png', status: 'pending' },
  { id: 2, date: '2025년 11월 20일', type: '간식', amount: '999,999원', image: '/images/RTBlogo.png', status: 'submitted' },
  { id: 3, date: '2025년 11월 20일', type: '간식', amount: '999,999원', image: '/images/RTBlogo.png', status: 'submitted' },
];

// 상태 뱃지 컴포넌트
const StatusBadge = ({ status }: { status: 'pending' | 'submitted' }) => {
  if (status === 'pending') {
    return (
      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs font-medium rounded">제출대기중</span>
    );
  }
  return (
    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">제출완료</span>
  );
};

export default function PersonalExpensePage() {
  const [selectedYear, setSelectedYear] = useState('2025년');
  const [selectedMonth, setSelectedMonth] = useState('11월');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 개인 차량 마일리지 상태
  const [mileageData, setMileageData] = useState({
    date: '',
    departure: '',
    arrival: '',
    distance: '',
    detail: '',
  });

  // 개인 카드/현금 지출내역 상태
  const [expenseData, setExpenseData] = useState({
    date: '',
    type: '',
    amount: '',
    detail: '',
    receipt: null as File | null,
  });

  const addDistance = (km: number) => {
    const current = parseInt(mileageData.distance) || 0;
    setMileageData({ ...mileageData, distance: String(current + km) });
  };

  // 마일리지 계산 (예: 1km당 200원)
  const calculateMileage = () => {
    const distance = parseInt(mileageData.distance) || 0;
    return distance * 200;
  };

  return (
    <div className="flex h-screen bg-white font-pretendard">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} activeMenu="지출 관리" activeSubMenu="개인 지출 기록" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-9 py-3 flex items-center gap-5">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <IconMenu />
          </button>
          <h1 className="font-bold text-[22px] text-gray-700">
            개인 지출 기록
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 lg:px-12 pt-6 pb-24">
          <div className="flex flex-col gap-6 max-w-[1200px]">
            {/* 조회 기간 */}
            <div className="flex flex-wrap items-center gap-5">
              <h2 className="text-[28px] font-bold text-gray-700 tracking-tight">
                조회 기간
              </h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold">
                  {selectedYear}
                  <IconChevronDown />
                </button>
                <button className="flex items-center gap-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold">
                  {selectedMonth}
                  <IconChevronDown />
                </button>
              </div>
            </div>

            {/* 두 개의 카드 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 개인 차량 마일리지 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IconCar />
                  <h3 className="text-lg font-semibold text-gray-700">개인 차량 마일리지</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex flex-col gap-5">
                    {/* 날짜 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="연도. 월. 일."
                          value={mileageData.date}
                          onChange={(e) => setMileageData({ ...mileageData, date: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <IconCalendar />
                        </div>
                      </div>
                    </div>

                    {/* 출발지 / 도착지 - 버튼 형식 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">출발지</label>
                        <div className="flex gap-2">
                          {locationOptions.map((option) => (
                            <button
                              key={`departure-${option}`}
                              onClick={() => setMileageData({ ...mileageData, departure: option })}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                mileageData.departure === option
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">도착지</label>
                        <div className="flex gap-2">
                          {locationOptions.map((option) => (
                            <button
                              key={`arrival-${option}`}
                              onClick={() => setMileageData({ ...mileageData, arrival: option })}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                mileageData.arrival === option
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 거리(km) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">거리(km)</label>
                      <input
                        type="text"
                        placeholder="예) 120"
                        value={mileageData.distance}
                        onChange={(e) => setMileageData({ ...mileageData, distance: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => addDistance(1)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                        >
                          +1km
                        </button>
                        <button 
                          onClick={() => addDistance(5)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                        >
                          +5km
                        </button>
                        <button 
                          onClick={() => addDistance(10)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                        >
                          +10km
                        </button>
                      </div>
                    </div>

                    {/* 상세내용 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상세내용</label>
                      <input
                        type="text"
                        placeholder="상세내용"
                        value={mileageData.detail}
                        onChange={(e) => setMileageData({ ...mileageData, detail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* 마일리지 + 추가 버튼 */}
                    <div className="flex items-center justify-between">
                      <span className="text-blue-500 font-medium">마일리지</span>
                      <span className="text-2xl font-bold text-gray-900">{calculateMileage().toLocaleString()}원</span>
                    </div>
                    <button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-lg transition-colors">
                      추가
                    </button>
                  </div>
                </div>

                {/* 마일리지 기록 목록 */}
                <div className="flex flex-col gap-3">
                  {mileageRecords.map((record) => (
                    <div key={record.id} className="bg-white border border-gray-200 rounded-2xl p-4 relative">
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                        <IconClose />
                      </button>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">{record.date}</span>
                        <StatusBadge status={record.status as 'pending' | 'submitted'} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">{record.amount}</span>
                        <span className="text-sm text-gray-500">{record.distance}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{record.from} → {record.to}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 개인 카드/현금 지출내역 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IconPayment />
                  <h3 className="text-lg font-semibold text-gray-700">개인 카드/현금 지출내역</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex flex-col gap-5">
                    {/* 날짜 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="연도. 월. 일."
                          value={expenseData.date}
                          onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <IconCalendar />
                        </div>
                      </div>
                    </div>

                    {/* 유형 / 금액 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                        <div className="relative">
                          <select 
                            value={expenseData.type}
                            onChange={(e) => setExpenseData({ ...expenseData, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="">유형 선택</option>
                            <option value="식비">식비</option>
                            <option value="간식">간식</option>
                            <option value="교통비">교통비</option>
                            <option value="숙박비">숙박비</option>
                            <option value="기타">기타</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <IconChevronDown />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">금액(원)</label>
                        <input
                          type="text"
                          placeholder="예) 26000"
                          value={expenseData.amount}
                          onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* 상세내용 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상세내용</label>
                      <input
                        type="text"
                        placeholder="상세내용"
                        value={expenseData.detail}
                        onChange={(e) => setExpenseData({ ...expenseData, detail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* 영수증 첨부 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">영수증 첨부</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          id="receipt-upload"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setExpenseData({ ...expenseData, receipt: file });
                            }
                          }}
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <IconUpload />
                            <span className="text-gray-600 font-medium">파일 업로드</span>
                            <span className="text-xs text-gray-400">Maximum 300 MB file size</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 추가 버튼 */}
                    <button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-lg transition-colors">
                      추가
                    </button>
                  </div>
                </div>

                {/* 지출 기록 목록 */}
                <div className="flex flex-col gap-3">
                  {expenseRecords.map((record) => (
                    <div key={record.id} className="bg-white border border-gray-200 rounded-2xl p-4 relative">
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                        <IconClose />
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                          <img src={record.image} alt="영수증" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">{record.type}</span>
                            <span className="text-sm text-gray-600">{record.date}</span>
                            <StatusBadge status={record.status as 'pending' | 'submitted'} />
                          </div>
                          <span className="text-xl font-bold text-gray-900">{record.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
