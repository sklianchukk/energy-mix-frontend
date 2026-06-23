import React, { useEffect, useState } from "react";
import EnergyMixChart from "../components/EnergyMixChart";
import ChargingWindowSelector from "../components/ChargingWindowSelector";
import OptimalWindowDisplay from "../components/OptimalWindowDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchEnergyMix, fetchOptimalWindow } from "../services/apiService";
import {
    EnergyMixData,
    OptimalWindowData,
    GenerationMixRecord,
} from "../types/index";
import { generationMixToChartData, getDayLabel } from "../utils/formatters";

const Dashboard: React.FC = () => {
    const [energyData, setEnergyData] = useState<EnergyMixData | null>(null);
    const [optimalWindow, setOptimalWindow] =
        useState<OptimalWindowData | null>(null);
    const [isLoadingEnergyData, setIsLoadingEnergyData] = useState(true);
    const [isLoadingOptimalWindow, setIsLoadingOptimalWindow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // fetch energy mix data on component mount
    useEffect(() => {
        const loadEnergyData = async () => {
            try {
                setIsLoadingEnergyData(true);
                setError(null);
                const data = await fetchEnergyMix();
                setEnergyData(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "failed to load energy data"
                );
            } finally {
                setIsLoadingEnergyData(false);
            }
        };

        loadEnergyData();
    }, []);

    const handleSelectWindow = async (hours: number) => {
        try {
            setIsLoadingOptimalWindow(true);
            setError(null);
            const data = await fetchOptimalWindow(hours);
            setOptimalWindow(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "failed to find optimal window"
            );
        } finally {
            setIsLoadingOptimalWindow(false);
        }
    };

    const dismissError = () => {
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        uk energy mix tracker
                    </h1>
                    <p className="text-gray-600">
                        find the optimal window to charge your electric vehicle
                    </p>
                </div>

                {/* error display */}
                {error && (
                    <ErrorDisplay message={error} onDismiss={dismissError} />
                )}

                {/* charging window selector */}
                <ChargingWindowSelector
                    onSelect={handleSelectWindow}
                    isLoading={isLoadingOptimalWindow}
                />

                {/* optimal window display */}
                {optimalWindow && (
                    <OptimalWindowDisplay
                        window={optimalWindow.chargingWindow}
                    />
                )}

                {/* energy mix charts */}
                {isLoadingEnergyData ? (
                    <LoadingSpinner message="loading energy mix data..." />
                ) : energyData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {energyData.days.map((day) => {
                            const chartData: GenerationMixRecord[] =
                                generationMixToChartData(day.generationmix);
                            return (
                                <EnergyMixChart
                                    key={day.date}
                                    data={chartData}
                                    title={getDayLabel(day.date)}
                                    cleanEnergyPercentage={
                                        day.cleanEnergyPercentage
                                    }
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        no energy data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
