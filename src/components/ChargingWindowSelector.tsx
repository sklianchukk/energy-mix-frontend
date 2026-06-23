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
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
            <div className="flex items-center gap-4">
                <label
                    htmlFor="hours"
                    className="text-lg font-semibold text-gray-700"
                >
                    charging window length:
                </label>
                <select
                    id="hours"
                    value={selectedHours}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={5}>5 hours</option>
                    <option value={6}>6 hours</option>
                </select>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                    {isLoading
                        ? "finding optimal window..."
                        : "find optimal window"}
                </button>
            </div>
        </form>
    );
};

export default ChargingWindowSelector;
