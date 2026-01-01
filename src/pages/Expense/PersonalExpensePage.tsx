import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/common/Header";
import MileageCard from "./components/MileageCard";
import ExpenseFormCard from "./components/ExpenseFormCard";
import ExpenseListItem from "./components/ExpenseListItem";
import YearMonthSelector from "../../components/common/YearMonthSelector";
import Button from "../../components/common/Button";

export default function PersonalExpensePage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const preselectedDate = params.get("date") || null;

    const [leftItems, setLeftItems] = useState<any[]>([]);
    const [rightItems, setRightItems] = useState<any[]>([]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("11");

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
            (y) => ({ value: String(y), label: `${y}년` })
        );
    }, []);

    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
            value: String(m).padStart(2, "0"),
            label: `${m}월`,
        }));
    }, []);

    const handleRemoveLeftItem = (id: number) => {
        setLeftItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleRemoveRightItem = (id: number) => {
        setRightItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="flex h-screen bg-[#f4f5f7] overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div
                className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-[239px] h-screen shrink-0
          transform transition-transform duration-300 ease-in-out
          ${
              sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
          }
        `}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
                <Header
                    title="개인 지출 기록"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* 조회 기간 */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-base font-semibold text-gray-700">
                                조회 기간
                            </span>
                            <YearMonthSelector
                                year={year}
                                month={month}
                                onYearChange={setYear}
                                onMonthChange={setMonth}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
                            <MileageCard
                                initialDate={preselectedDate || undefined}
                                onAdd={(item) =>
                                    setLeftItems((prev) => [item, ...prev])
                                }
                            />
                            <ExpenseFormCard
                                initialDate={preselectedDate || undefined}
                                onAdd={(item) =>
                                    setRightItems((prev) => [item, ...prev])
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                            <div>
                                {leftItems.length === 0 ? (
                                    <div className="text-gray-400 py-8 text-center rounded-lg border border-dashed border-gray-200 bg-white">
                                        등록된 마일리지 내역이 없습니다.
                                    </div>
                                ) : (
                                    leftItems.map((it) => (
                                        <ExpenseListItem
                                            key={it.id}
                                            date={it.date || ""}
                                            tag={"개인"}
                                            desc={it.note || ""}
                                            amount={`${it.cost?.toLocaleString("ko-KR") || 0}원 ${it.distance || 0}km`}
                                            onRemove={() => handleRemoveLeftItem(it.id)}
                                        />
                                    ))
                                )}
                            </div>

                            <div>
                                {rightItems.length === 0 ? (
                                    <div className="text-gray-400 py-8 text-center rounded-lg border border-dashed border-gray-200 bg-white">
                                        등록된 지출 내역이 없습니다.
                                    </div>
                                ) : (
                                    rightItems.map((it) => (
                                        <ExpenseListItem
                                            key={it.id}
                                            date={it.date || ""}
                                            tag={it.type || "기타"}
                                            desc={it.detail || ""}
                                            amount={`${Number(it.amount || 0).toLocaleString("ko-KR")}원`}
                                            img={it.img}
                                            onRemove={() => handleRemoveRightItem(it.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="fixed bottom-6 left-6 right-6 lg:left-[239px]">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() =>
                                    alert(
                                        "제출 처리: " +
                                            (leftItems.length +
                                                rightItems.length) +
                                            "개"
                                    )
                                }
                            >
                                모두 제출 ({leftItems.length + rightItems.length}개)
                            </Button>
                        </div>

                        <div className="h-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}
