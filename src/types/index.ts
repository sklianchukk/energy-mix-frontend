// type definitions for frontend

export interface EnergyMixDay {
    date: string;
    generationmix: Record<string, number>;
    cleanEnergyPercentage: number;
}

export interface EnergyMixData {
    days: EnergyMixDay[];
}

export interface ChargingWindow {
    startDateTime: string;
    endDateTime: string;
    averageCleanEnergyPercentage: number;
    windowLengthHours: number;
}

export interface OptimalWindowData {
    chargingWindow: ChargingWindow;
}

export interface GenerationMixRecord {
    name: string;
    value: number;
    color: string;
}
