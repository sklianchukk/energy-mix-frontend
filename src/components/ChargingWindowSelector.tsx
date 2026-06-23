import React, { useState } from "react";

interface ChargingWindowSelectorProps {
    onSelect: (hours: number) => void;
    isLoading: boolean;
}

const ChargingWindowSelector: React.FC<ChargingWindowSelectorProps> = ({
    onSelect,
    isLoading,
}) => {
    const [selectedHours, setSelectedHours] = useState<number>(2);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedHours(parseInt(e.target.value, 10));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSelect(selectedHours);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
        >
            <div className="flex flex-row items-center justify-center gap-4">
                <label
                    htmlFor="hours"
                    className="text-lg font-semibold text-gray-700 whitespace-nowrap"
                >
                    charging window length:
                </label>
                <select
                    id="hours"
                    value={selectedHours}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-gray-50 font-medium"
                >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={5}>5 hours</option>
                    <option value={6}>6 hours</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
                {isLoading
                    ? "finding optimal window..."
                    : "find optimal window"}
            </button>
        </form>
    );
};

export default ChargingWindowSelector;
