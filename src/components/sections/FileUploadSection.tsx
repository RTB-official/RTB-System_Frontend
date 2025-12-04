const IconFileUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z" fill="#364153" />
  </svg>
);

const IconAdd = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
  </svg>
);

const IconCancel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="#99a1af" />
  </svg>
);

const IconBed = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V10C2.9 10 2 10.9 2 12V17H3.33L4 19H5L5.67 17H18.33L19 19H20L20.67 17H22V12C22 10.9 21.1 10 20 10ZM11 10H6V7H11V10ZM18 10H13V7H18V10Z" fill="#101828" />
  </svg>
);

const IconHandyman = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.67 18.17L14.5 11L15.91 9.59C16.07 9.75 16.3 9.75 16.45 9.59L20.79 5.25C20.95 5.09 20.95 4.86 20.79 4.71L19.29 3.21C19.13 3.05 18.9 3.05 18.75 3.21L14.41 7.55C14.25 7.71 14.25 7.94 14.41 8.09L13 9.5L6.83 3.33C6.64 3.14 6.31 3.14 6.12 3.33L3.33 6.12C3.14 6.31 3.14 6.64 3.33 6.83L9.5 13L8.09 14.41C7.94 14.25 7.71 14.25 7.55 14.41L3.21 18.75C3.05 18.91 3.05 19.14 3.21 19.29L4.71 20.79C4.87 20.95 5.1 20.95 5.25 20.79L9.59 16.45C9.75 16.29 9.75 16.06 9.59 15.91L11 14.5L18.17 21.67C18.36 21.86 18.69 21.86 18.88 21.67L21.67 18.88C21.86 18.69 21.86 18.36 21.67 18.17Z" fill="#101828" />
  </svg>
);

const IconForkSpoon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 10C15.5 7.12 14.86 3 12 3C9.14 3 8.5 7.12 8.5 10C8.5 12.24 9.66 14.11 11 14.75V21H13V14.75C14.34 14.11 15.5 12.24 15.5 10ZM19 3V10C19 11.52 17.54 13 16 13H14.75V21H13V11H9V21H7.25V13H6C4.46 13 3 11.52 3 10V3H5V10H7V3H9V10H11V3H13V10H15V3H17V10H19V3H19Z" fill="#101828" />
  </svg>
);

const IconFolder = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="#101828" />
  </svg>
);

interface FileUploadCardProps {
  icon: React.ReactNode;
  title: string;
  uploadedFiles?: { name: string; thumbnail?: string }[];
}

function FileUploadCard({ icon, title, uploadedFiles = [] }: FileUploadCardProps) {
  return (
    <div className="flex-1 bg-[#f9fafb] border border-[#f3f4f6] rounded-2xl p-3 md:p-4 flex flex-col gap-3 md:gap-4 overflow-hidden min-w-0">
      <div className="flex gap-2 items-center">
        {icon}
        <span className="font-semibold text-[14px] md:text-[16px] text-[#101828] truncate">
          {title}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 items-center">
        <button className="w-full bg-[#364153] rounded-[10px] px-3 py-2 flex gap-0.5 items-center justify-center text-white hover:bg-[#1f2937] transition-colors">
          <IconAdd />
          <span className="font-medium text-[12px] md:text-[14px] text-center">파일 추가</span>
        </button>
        
        {uploadedFiles.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            <p className="text-[12px] md:text-[14px] text-[#99a1af] text-center">
              업로드 된 파일 ({uploadedFiles.length}개)
            </p>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="bg-white border border-[#e5e7eb] rounded-lg p-2 flex items-center justify-between">
                <div className="flex gap-2 md:gap-4 items-center min-w-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {file.thumbnail && (
                      <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="text-[12px] md:text-[14px] text-[#314158] truncate">{file.name}</span>
                </div>
                <button className="hover:opacity-70 flex-shrink-0">
                  <IconCancel />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] md:text-[12px] text-[#99a1af] text-center">
            업로드 된 파일이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default function FileUploadSection() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 md:p-7 overflow-hidden flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <IconFileUpload />
          <h2 className="text-[18px] md:text-[22px] font-semibold text-[#364153] leading-[1.364] tracking-[-0.43px]">
            첨부파일 업로드
          </h2>
        </div>
        <p className="text-[12px] md:text-[13px] text-[#99a1af] leading-[1.385]">
          영수증, TBM, 작업사진 등 (최대 10MB, PNG, JPG, PDF 지원)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FileUploadCard
          icon={<IconBed />}
          title="숙박 영수증"
          uploadedFiles={[{ name: 'imageName.png' }]}
        />
        <FileUploadCard
          icon={<IconHandyman />}
          title="자재 영수증"
        />
        <FileUploadCard
          icon={<IconForkSpoon />}
          title="식비 영수증"
        />
        <FileUploadCard
          icon={<IconFolder />}
          title="기타 (TBM, 작업사진 등)"
        />
      </div>
    </div>
  );
}

