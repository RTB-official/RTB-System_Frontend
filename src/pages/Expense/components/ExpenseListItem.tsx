import React from "react";

export default function ExpenseListItem({
    date,
    tag,
    desc,
    amount,
    img,
    onRemove,
}: {
    date: string;
    tag: string;
    desc: string;
    amount: string;
    img?: string;
    onRemove?: () => void;
}) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-400">{date}</div>
                    <button className="text-[13px] text-blue-600 ml-1">
                        {tag}
                    </button>
                </div>
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mt-2">
                <div>
                    <div className="text-lg font-extrabold text-gray-900">
                        {amount}
                    </div>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-3">
                    {img ? (
                        <img
                            src={img}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                        />
                    ) : null}
                    <div>{desc}</div>
                </div>
            </div>
        </div>
    );
}
