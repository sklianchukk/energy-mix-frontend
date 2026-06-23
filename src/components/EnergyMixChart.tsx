import React, { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";
import { GenerationMixRecord } from "../types/index";

interface EnergyMixChartProps {
    data: GenerationMixRecord[];
    title: string;
    cleanEnergyPercentage: number;
}

// threshold options users can choose from
const THRESHOLD_OPTIONS = [
    { label: "Show all", value: 0 },
    { label: "≥ 1%", value: 1 },
    { label: "≥ 2%", value: 2 },
    { label: "≥ 5%", value: 5 },
];

// merge slices below threshold into a single "Other" slice
function applyThreshold(
    data: GenerationMixRecord[],
    threshold: number
): GenerationMixRecord[] {
    if (threshold === 0) return data;

    const visible = data.filter((d) => d.value >= threshold);
    const hidden = data.filter((d) => d.value < threshold);

    if (hidden.length === 0) return visible;

    const otherValue = hidden.reduce((sum, d) => sum + d.value, 0);

    // if there's already an "Other" slice, merge into it
    const existingOther = visible.find((d) => d.name === "Other");
    if (existingOther) {
        return visible.map((d) =>
            d.name === "Other"
                ? {
                      ...d,
                      value: Math.round((d.value + otherValue) * 100) / 100,
                  }
                : d
        );
    }

    return [
        ...visible,
        {
            name: "Other",
            value: Math.round(otherValue * 100) / 100,
            color: "#d1d5db",
        },
    ];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg text-sm">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-gray-600">{payload[0].value?.toFixed(2)}%</p>
            </div>
        );
    }
    return null;
};

const EnergyMixChart: React.FC<EnergyMixChartProps> = ({
    data,
    title,
    cleanEnergyPercentage,
}) => {
    const [threshold, setThreshold] = useState(2);
    const [filterOpen, setFilterOpen] = useState(false);

    const displayData = applyThreshold(data, threshold);
    const hiddenCount = data.filter((d) => d.value < threshold).length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>

                <div className="relative">
                    <button
                        onClick={() => setFilterOpen((o) => !o)}
                        title="Filter small slices"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 16 16"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                d="M2 4h12M2 8h12M2 12h12"
                            />
                        </svg>
                        Filter
                        {hiddenCount > 0 && (
                            <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-blue-500 text-white rounded-full">
                                {hiddenCount}
                            </span>
                        )}
                    </button>

                    {filterOpen && (
                        <div className="absolute right-0 top-9 z-20 w-56 sm:w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                            <p className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                Hide slices smaller than
                            </p>
                            {THRESHOLD_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setThreshold(opt.value);
                                        setFilterOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                        threshold === opt.value
                                            ? "bg-blue-50 text-blue-700 font-semibold"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {opt.label}
                                    {threshold === opt.value && (
                                        <span className="float-right text-blue-500">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3 text-center">
                <p className="text-4xl font-bold text-green-600">
                    {cleanEnergyPercentage.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">
                    clean energy
                </p>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={displayData}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        strokeWidth={1}
                        stroke="#fff"
                    >
                        {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            <div className="w-full mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {displayData.map((entry) => (
                    <div
                        key={entry.name}
                        className="flex items-center gap-1.5 min-w-0"
                    >
                        <span
                            className="flex-shrink-0 w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-600 truncate">
                            {entry.name}
                        </span>
                        <span className="text-xs font-semibold text-gray-800 ml-auto flex-shrink-0">
                            {entry.value.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>

            {hiddenCount > 0 && (
                <p className="mt-2 text-[11px] text-gray-400 italic">
                    {hiddenCount} source{hiddenCount > 1 ? "s" : ""} grouped
                    into "Other"
                </p>
            )}

            {filterOpen && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setFilterOpen(false)}
                />
            )}
        </div>
    );
};

export default EnergyMixChart;
