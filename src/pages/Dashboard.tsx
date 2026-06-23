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
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-4 sm:6 py-8 sm:py-12">
                <div className="mb-10 text-center px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-3 tracking-tight pb-2">
                        UK energy mix tracker
                    </h1>
                    <p className="text-gray-600">
                        find the optimal window to charge your electric vehicle
                    </p>
                </div>

                {error && (
                    <ErrorDisplay message={error} onDismiss={dismissError} />
                )}

                <ChargingWindowSelector
                    onSelect={handleSelectWindow}
                    isLoading={isLoadingOptimalWindow}
                />

                {optimalWindow && (
                    <OptimalWindowDisplay
                        window={optimalWindow.chargingWindow}
                    />
                )}

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
