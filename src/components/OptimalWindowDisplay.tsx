import React from "react";
import { ChargingWindow } from "../types/index";
import { formatDateTimeUTC } from "../utils/formatters";

interface OptimalWindowDisplayProps {
    window: ChargingWindow;
}

const OptimalWindowDisplay: React.FC<OptimalWindowDisplayProps> = ({
    window,
}) => {
    return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-8 mb-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                optimal charging window
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        start
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                        {formatDateTimeUTC(window.startDateTime)}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        end
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                        {formatDateTimeUTC(window.endDateTime)}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        average clean energy
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                        {window.averageCleanEnergyPercentage.toFixed(2)}%
                    </p>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                    window length
                </p>
                <p className="text-lg font-semibold text-gray-800">
                    {window.windowLengthHours} hour
                    {window.windowLengthHours !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
};

export default OptimalWindowDisplay;
