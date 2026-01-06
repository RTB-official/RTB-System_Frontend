import { useEffect, useMemo, useState } from "react";
import BaseModal from "./BaseModal";
import Input from "../common/Input";
import Button from "../common/Button";

type LeaveType = "FULL" | "AM" | "PM";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableDays: number;
  onSubmit: (payload: {
    date: string;
    leaveType: LeaveType;
    reason: string;
  }) => void;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatKoreanDate(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const weekday = dt.toLocaleDateString("ko-KR", { weekday: "short" });
  return `${y}. ${pad2(m)}. ${pad2(d)}.(${weekday})`;
}

export default function VacationRequestModal({
  isOpen,
  onClose,
  availableDays,
  onSubmit,
}: Props) {
  const todayISO = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }, []);

  const [dateISO, setDateISO] = useState(todayISO);
  const [leaveType, setLeaveType] = useState<LeaveType>("FULL");
  const [reason, setReason] = useState("개인 사유");

  useEffect(() => {
    if (isOpen) {
      setDateISO(todayISO);
      setLeaveType("FULL");
      setReason("개인 사유");
    }
  }, [isOpen, todayISO]);

  const handleAdd = () => {
    if (!dateISO) return alert("날짜를 선택해주세요.");
    if (!reason.trim()) return alert("상세내용을 입력해주세요.");

    onSubmit({
      date: dateISO,
      leaveType,
      reason: reason.trim(),
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-baseline gap-2">
          <span>휴가 신청</span>
          <span className="text-[13px] font-bold text-gray-400">
            총 {availableDays}일 사용 가능
          </span>
        </div>
      }
      maxWidth="max-w-[640px]"
    >
      <div className="space-y-5">
        {/* 날짜 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            날짜
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 font-medium text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[14px] font-medium text-gray-900">
              {formatKoreanDate(dateISO)}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
              📅
            </div>
            <style>
              {`
                input[type="date"]::-webkit-datetime-edit { opacity: 0; }
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; }
              `}
            </style>
          </div>
        </div>

        {/* 휴가 유형 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            휴가 유형
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={leaveType === "FULL" ? "primary" : "outline"}
              size="md"
              onClick={() => setLeaveType("FULL")}
              className={
                leaveType === "FULL"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-800"
              }
            >
              하루 종일
            </Button>
            <Button
              variant={leaveType === "AM" ? "primary" : "outline"}
              size="md"
              onClick={() => setLeaveType("AM")}
              className={
                leaveType === "AM"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-800"
              }
            >
              오전 반차
            </Button>
            <Button
              variant={leaveType === "PM" ? "primary" : "outline"}
              size="md"
              onClick={() => setLeaveType("PM")}
              className={
                leaveType === "PM"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-800"
              }
            >
              오후 반차
            </Button>
          </div>
        </div>

        {/* 상세내용 */}
        <Input
          label="상세내용"
          value={reason}
          onChange={setReason}
          placeholder="예) 개인 사유"
          required
        />

        {/* 제출 버튼 */}
        <div className="pt-2">
          <Button variant="primary" size="md" fullWidth onClick={handleAdd}>
            추가
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
