import {
    generationMixToChartData,
    getDayLabel,
    isCleanEnergy,
    formatDateDisplay,
} from "../utils/formatters";

describe("formatters utilities", () => {
    describe("generationMixToChartData", () => {
        it("should convert generation mix to chart data format", () => {
            const generationmix = {
                wind: 30,
                solar: 20,
                gas: 50,
            };

            const result = generationMixToChartData(generationmix);

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe("Gas");
            expect(result[0].value).toBe(50);
        });

        it("should sort data by value in descending order", () => {
            const generationmix = {
                wind: 10,
                nuclear: 40,
                solar: 20,
            };

            const result = generationMixToChartData(generationmix);

            expect(result[0].value).toBe(40);
            expect(result[1].value).toBe(20);
            expect(result[2].value).toBe(10);
        });

        it("should assign colors to fuel types", () => {
            const generationmix = {
                wind: 50,
            };

            const result = generationMixToChartData(generationmix);

            expect(result[0].color).toBe("#3b82f6");
        });
    });

    describe("isCleanEnergy", () => {
        it("should identify clean energy sources", () => {
            expect(isCleanEnergy("wind")).toBe(true);
            expect(isCleanEnergy("solar")).toBe(true);
            expect(isCleanEnergy("nuclear")).toBe(true);
            expect(isCleanEnergy("hydro")).toBe(true);
            expect(isCleanEnergy("biomass")).toBe(true);
        });

        it("should identify non-clean energy sources", () => {
            expect(isCleanEnergy("gas")).toBe(false);
            expect(isCleanEnergy("coal")).toBe(false);
            expect(isCleanEnergy("oil")).toBe(false);
        });

        it("should be case-insensitive", () => {
            expect(isCleanEnergy("Wind")).toBe(true);
            expect(isCleanEnergy("SOLAR")).toBe(true);
        });
    });

    describe("formatDateDisplay", () => {
        it("should format date string for display", () => {
            const result = formatDateDisplay("2026-06-22");
            expect(result).toContain("Jun");
            expect(result).toContain("22");
            expect(result).toContain("2026");
        });
    });

    describe("getDayLabel", () => {
        it("should return today for current date", () => {
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            expect(getDayLabel(dateStr)).toBe("Today");
        });

        it("should return formatted date for other dates", () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);
            const dateStr = futureDate.toISOString().split("T")[0];
            const result = getDayLabel(dateStr);
            expect(result).toContain("2026");
        });
    });
});
