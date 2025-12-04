import SectionCard from '../ui/SectionCard';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Chip from '../ui/Chip';

const vehicles = [
  ['5423', '4272', '0892'],
  ['5739', '6297', '0598'],
  ['7203', '카니발', '자차'],
];

export default function BasicInfoSection() {
  return (
    <SectionCard title="기본 정보">
      <div className="flex flex-col gap-5 md:gap-7">
        {/* 작성자 */}
        <TextInput 
          label="작성자" 
          placeholder="이름을 입력해 주세요" 
          required 
        />

        {/* 참관감독 선택 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <Select 
            label="참관감독" 
            placeholder="부서 선택" 
            className="flex-1" 
          />
          <Select 
            placeholder="감독 선택" 
            className="flex-1" 
          />
        </div>

        {/* 운행차량 */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[14px] md:text-[15px] text-[#101828] leading-[1.467]">
            운행차량 (다중 선택 가능)
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {vehicles.flat().map((vehicle) => (
              <Chip key={vehicle} className="w-full" size="lg">
                {vehicle}
              </Chip>
            ))}
          </div>
        </div>

        {/* 출장지, 호선명 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
          <Select 
            label="출장지" 
            placeholder="출장지 선택" 
            required 
            className="flex-1" 
          />
          <TextInput 
            label="호선명" 
            placeholder="예) 한국호" 
            className="flex-1" 
          />
        </div>

        {/* 출장목적 */}
        <TextInput 
          label="출장목적" 
          placeholder="선박 점검 및 정비" 
          required 
        />

        {/* 엔진타입 */}
        <TextInput 
          label="엔진타입" 
          placeholder="엔진 타입을 입력해 주세요" 
        />
      </div>
    </SectionCard>
  );
}

