import React from "react";

export default function ExpenseHeader({
    year,
    month,
}: {
    year?: string;
    month?: string;
}) {
    return (
        <header className="-mx-6 py-4 mb-6 border-b border-gray-200">
            <div className="px-6">
                <h1 className="text-2xl font-semibold">개인 지출</h1>
            </div>
        </header>
    );
}
