interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, children, headerContent, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-white border border-[#e5e7eb] rounded-2xl p-4 md:p-7 overflow-hidden flex flex-col gap-4 md:gap-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <h2 className="text-[18px] md:text-[22px] font-semibold text-[#364153] leading-[1.364] tracking-[-0.43px]">
          {title}
        </h2>
        {headerContent}
      </div>
      {children}
    </div>
  );
}

