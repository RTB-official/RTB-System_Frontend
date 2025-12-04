const IconArrowDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 15L17 10H7Z" fill="#101828" />
  </svg>
);

interface SelectProps {
  label?: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}

export default function Select({ label, placeholder, required = false, className = '' }: SelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex gap-1 items-center">
          <label className="font-medium text-[15px] text-[#101828] leading-[1.467]">
            {label}
          </label>
          {required && <span className="text-[#e7000b] text-[15px]">*</span>}
        </div>
      )}
      <button className="bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-[16px] text-[#99a1af] leading-[1.5]">
          {placeholder}
        </span>
        <IconArrowDown />
      </button>
    </div>
  );
}

