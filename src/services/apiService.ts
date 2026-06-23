// service for communicating with the backend api

import { EnergyMixData, OptimalWindowData } from "../types/index";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function fetchEnergyMix(): Promise<EnergyMixData> {
    try {
        const response = await fetch(`${API_BASE_URL}/energy-mix`);
        if (!response.ok) {
            throw new Error(`api error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(
            `failed to fetch energy mix: ${
                error instanceof Error ? error.message : "unknown error"
            }`
        );
    }
}

export async function fetchOptimalWindow(
    windowLengthHours: number
): Promise<OptimalWindowData> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/optimal-window?hours=${windowLengthHours}`
        );
        if (!response.ok) {
            throw new Error(`api error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(
            `failed to fetch optimal window: ${
                error instanceof Error ? error.message : "unknown error"
            }`
        );
    }
}
