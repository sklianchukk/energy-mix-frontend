import { GenerationMixRecord } from "../types/index";

const FUEL_COLORS: Record<string, string> = {
    wind: "#3b82f6",
    solar: "#fbbf24",
    nuclear: "#8b5cf6",
    hydro: "#06b6d4",
    biomass: "#10b981",
    gas: "#f97316",
    coal: "#6b7280",
    imports: "#14b8a6",
    oil: "#64748b",
    other: "#d1d5db",
};

export function formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTimeDisplay(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/London",
    });
}

export function formatDateTimeUTC(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
}

export function getDayLabel(dateString: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const [year, month, day] = dateString.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (dateObj.getTime() === today.getTime()) {
        return "Today";
    } else if (dateObj.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
    } else if (dateObj.getTime() === dayAfterTomorrow.getTime()) {
        return "Day After Tomorrow";
    }

    return formatDateDisplay(dateString);
}

export function generationMixToChartData(
    generationmix: Record<string, number>
): GenerationMixRecord[] {
    return Object.entries(generationmix)
        .map(([fuel, percentage]) => ({
            name: fuel.charAt(0).toUpperCase() + fuel.slice(1),
            value: percentage,
            color: FUEL_COLORS[fuel] || FUEL_COLORS.other,
        }))
        .sort((a, b) => b.value - a.value);
}

export function isCleanEnergy(fuelType: string): boolean {
    const cleanTypes = ["biomass", "nuclear", "hydro", "wind", "solar"];
    return cleanTypes.includes(fuelType.toLowerCase());
}
