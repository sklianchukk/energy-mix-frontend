// integration tests for apiService — mocks the global fetch

import { fetchEnergyMix, fetchOptimalWindow } from "../services/apiService";

const mockFetch = jest.fn();
global.fetch = mockFetch;

afterEach(() => {
    jest.clearAllMocks();
});

// ------------------------------------------------------------------
// fetchEnergyMix
// ------------------------------------------------------------------
describe("fetchEnergyMix", () => {
    const fakeResponse = {
        days: [
            { date: "2026-06-23", generationmix: { wind: 30 }, cleanEnergyPercentage: 30 },
        ],
    };

    it("should return parsed energy mix data on success", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => fakeResponse,
        });

        const result = await fetchEnergyMix();

        expect(result).toEqual(fakeResponse);
        expect(result.days).toHaveLength(1);
    });

    it("should call the correct endpoint", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => fakeResponse,
        });

        await fetchEnergyMix();

        const calledUrl = mockFetch.mock.calls[0][0] as string;
        expect(calledUrl).toContain("/energy-mix");
    });

    it("should throw a meaningful error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            statusText: "Internal Server Error",
        });

        await expect(fetchEnergyMix()).rejects.toThrow(
            "failed to fetch energy mix"
        );
    });

    it("should throw when network request fails entirely", async () => {
        mockFetch.mockRejectedValue(new Error("network error"));

        await expect(fetchEnergyMix()).rejects.toThrow("failed to fetch energy mix");
    });
});

// ------------------------------------------------------------------
// fetchOptimalWindow
// ------------------------------------------------------------------
describe("fetchOptimalWindow", () => {
    const fakeWindow = {
        chargingWindow: {
            startDateTime: "2026-06-24T10:00Z",
            endDateTime: "2026-06-24T12:00Z",
            averageCleanEnergyPercentage: 67.5,
            windowLengthHours: 2,
        },
    };

    it("should return parsed optimal window data on success", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => fakeWindow,
        });

        const result = await fetchOptimalWindow(2);

        expect(result).toEqual(fakeWindow);
        expect(result.chargingWindow.windowLengthHours).toBe(2);
    });

    it("should include hours query param in the request url", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => fakeWindow,
        });

        await fetchOptimalWindow(3);

        const calledUrl = mockFetch.mock.calls[0][0] as string;
        expect(calledUrl).toContain("hours=3");
    });

    it("should throw a meaningful error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            statusText: "Bad Request",
        });

        await expect(fetchOptimalWindow(2)).rejects.toThrow(
            "failed to fetch optimal window"
        );
    });

    it("should throw when network request fails entirely", async () => {
        mockFetch.mockRejectedValue(new Error("timeout"));

        await expect(fetchOptimalWindow(2)).rejects.toThrow(
            "failed to fetch optimal window"
        );
    });

    it("should pass different hour values correctly", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => fakeWindow,
        });

        for (const hours of [1, 2, 3, 4, 5, 6]) {
            await fetchOptimalWindow(hours);
            const calledUrl = mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0] as string;
            expect(calledUrl).toContain(`hours=${hours}`);
        }
    });
});
