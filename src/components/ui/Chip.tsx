interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'selected' | 'gray' | 'tag';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export default function Chip({ 
  children, 
  variant = 'default', 
  size = 'md', 
  onClick, 
  onRemove,
  className = '' 
}: ChipProps) {
  const baseClasses = 'flex gap-1 items-center justify-center rounded-[10px] transition-colors';
  
  const variantClasses = {
    default: 'bg-white border border-[#e5e7eb] text-[#364153]',
    selected: 'bg-[#2b7fff] text-white',
    gray: 'bg-[#f3f4f6] text-[#4a5565]',
    tag: 'bg-[#eff6ff] text-[#2b7fff] rounded-full',
  };

  const sizeClasses = {
    sm: 'h-[30px] px-2 py-1.5 text-[13px]',
    md: 'h-9 px-2.5 py-3 text-[15px]',
    lg: 'h-12 px-4 py-3 text-[16px]',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span className="font-medium leading-[1.467] text-center whitespace-nowrap">
        {children}
      </span>
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-1">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
            <path d="M8.25 2.75L2.75 8.25M2.75 2.75L8.25 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

