interface TextInputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function TextInput({ label, placeholder, required = false, icon, className = '' }: TextInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-1 items-center">
        <label className="font-medium text-[15px] text-[#101828] leading-[1.467]">
          {label}
        </label>
        {required && <span className="text-[#e7000b] text-[15px]">*</span>}
      </div>
      <div className="bg-white border border-[#e5e7eb] rounded-xl h-12 flex items-center overflow-hidden p-3">
        <div className="flex-1 flex items-center justify-between min-h-[24px] px-1">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 font-normal text-[16px] text-[#101828] leading-[1.5] placeholder:text-[#99a1af] outline-none"
          />
          {icon}
        </div>
      </div>
    </div>
  );
}

