// render tests for React components using @testing-library/react

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnergyMixChart from "../components/EnergyMixChart";
import ChargingWindowSelector from "../components/ChargingWindowSelector";
import OptimalWindowDisplay from "../components/OptimalWindowDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";

// recharts uses SVG and ResizeObserver — mock them for jsdom
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// ------------------------------------------------------------------
// EnergyMixChart
// ------------------------------------------------------------------
describe("EnergyMixChart", () => {
    const chartData = [
        { name: "Wind", value: 40, color: "#3b82f6" },
        { name: "Gas", value: 40, color: "#f97316" },
        { name: "Nuclear", value: 20, color: "#8b5cf6" },
    ];

    it("should render the chart title", () => {
        render(
            <EnergyMixChart
                data={chartData}
                title="Today"
                cleanEnergyPercentage={60}
            />
        );
        expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should display clean energy percentage", () => {
        render(
            <EnergyMixChart
                data={chartData}
                title="Tomorrow"
                cleanEnergyPercentage={45.5}
            />
        );
        expect(screen.getByText("45.50%")).toBeInTheDocument();
        expect(screen.getByText("clean energy")).toBeInTheDocument();
    });

    it("should render a chart wrapper element", () => {
        const { container } = render(
            <EnergyMixChart
                data={chartData}
                title="Today"
                cleanEnergyPercentage={60}
            />
        );
        expect(container.firstChild).toBeTruthy();
        expect(container.firstChild).toHaveClass("bg-white");
    });

    it("should render the filter button", () => {
        render(
            <EnergyMixChart
                data={chartData}
                title="Today"
                cleanEnergyPercentage={60}
            />
        );
        expect(screen.getByTitle("Filter small slices")).toBeInTheDocument();
    });

    it("should open filter dropdown on button click", () => {
        render(
            <EnergyMixChart
                data={chartData}
                title="Today"
                cleanEnergyPercentage={60}
            />
        );
        fireEvent.click(screen.getByTitle("Filter small slices"));
        expect(screen.getByText("Hide slices smaller than")).toBeInTheDocument();
    });

    it("should show legend items for all data entries above threshold", () => {
        render(
            <EnergyMixChart
                data={chartData}
                title="Today"
                cleanEnergyPercentage={60}
            />
        );
        // default threshold is 2%, all entries are above it
        expect(screen.getByText("Wind")).toBeInTheDocument();
        expect(screen.getByText("Gas")).toBeInTheDocument();
        expect(screen.getByText("Nuclear")).toBeInTheDocument();
    });

    it("should group small slices into Other when threshold applied", () => {
        const dataWithSmall = [
            { name: "Gas", value: 80, color: "#f97316" },
            { name: "Wind", value: 15, color: "#3b82f6" },
            { name: "Coal", value: 0.5, color: "#6b7280" }, // below default 2%
        ];
        render(
            <EnergyMixChart
                data={dataWithSmall}
                title="Today"
                cleanEnergyPercentage={15}
            />
        );
        // "Coal" (0.5%) should be merged into "Other" with default threshold=2%
        expect(screen.queryByText("Coal")).not.toBeInTheDocument();
        expect(screen.getByText("Other")).toBeInTheDocument();
    });
});

// ------------------------------------------------------------------
// ChargingWindowSelector
// ------------------------------------------------------------------
describe("ChargingWindowSelector", () => {
    it("should render the select dropdown with options 1–6", () => {
        render(<ChargingWindowSelector onSelect={jest.fn()} isLoading={false} />);
        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();

        for (let h = 1; h <= 6; h++) {
            expect(screen.getByRole("option", { name: `${h} hour${h > 1 ? "s" : ""}` })).toBeInTheDocument();
        }
    });

    it("should render the submit button", () => {
        render(<ChargingWindowSelector onSelect={jest.fn()} isLoading={false} />);
        expect(screen.getByRole("button", { name: /find optimal window/i })).toBeInTheDocument();
    });

    it("should call onSelect with the selected value on submit", () => {
        const handleSelect = jest.fn();
        render(<ChargingWindowSelector onSelect={handleSelect} isLoading={false} />);

        // change to 4 hours
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "4" } });

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(handleSelect).toHaveBeenCalledWith(4);
    });

    it("should disable inputs and show loading text when isLoading is true", () => {
        render(<ChargingWindowSelector onSelect={jest.fn()} isLoading={true} />);

        expect(screen.getByRole("combobox")).toBeDisabled();
        expect(screen.getByRole("button")).toBeDisabled();
        expect(screen.getByText(/finding optimal window/i)).toBeInTheDocument();
    });

    it("should not call onSelect when form is submitted while loading", () => {
        const handleSelect = jest.fn();
        render(<ChargingWindowSelector onSelect={handleSelect} isLoading={true} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // button is disabled so form submission should not reach onSelect
        expect(handleSelect).not.toHaveBeenCalled();
    });
});

// ------------------------------------------------------------------
// OptimalWindowDisplay
// ------------------------------------------------------------------
describe("OptimalWindowDisplay", () => {
    const windowData = {
        startDateTime: "2026-06-24T10:00Z",
        endDateTime: "2026-06-24T12:00Z",
        averageCleanEnergyPercentage: 67.5,
        windowLengthHours: 2,
    };

    it("should render the heading", () => {
        render(<OptimalWindowDisplay window={windowData} />);
        expect(screen.getByText(/optimal charging window/i)).toBeInTheDocument();
    });

    it("should display start and end labels", () => {
        render(<OptimalWindowDisplay window={windowData} />);
        expect(screen.getByText("start")).toBeInTheDocument();
        expect(screen.getByText("end")).toBeInTheDocument();
    });

    it("should display average clean energy percentage", () => {
        render(<OptimalWindowDisplay window={windowData} />);
        expect(screen.getByText("67.50%")).toBeInTheDocument();
    });

    it("should display window length in hours (plural)", () => {
        render(<OptimalWindowDisplay window={windowData} />);
        expect(screen.getByText("2 hours")).toBeInTheDocument();
    });

    it("should display window length in hours (singular)", () => {
        render(
            <OptimalWindowDisplay
                window={{ ...windowData, windowLengthHours: 1 }}
            />
        );
        expect(screen.getByText("1 hour")).toBeInTheDocument();
    });
});

// ------------------------------------------------------------------
// ErrorDisplay
// ------------------------------------------------------------------
describe("ErrorDisplay", () => {
    it("should render the error message", () => {
        render(<ErrorDisplay message="something went wrong" onDismiss={jest.fn()} />);
        expect(screen.getByText("something went wrong")).toBeInTheDocument();
    });

    it('should render the "error" heading', () => {
        render(<ErrorDisplay message="some error" onDismiss={jest.fn()} />);
        expect(screen.getByText("error")).toBeInTheDocument();
    });

    it("should call onDismiss when the close button is clicked", () => {
        const handleDismiss = jest.fn();
        render(<ErrorDisplay message="some error" onDismiss={handleDismiss} />);

        const closeButton = screen.getByRole("button");
        fireEvent.click(closeButton);

        expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
});

// ------------------------------------------------------------------
// LoadingSpinner
// ------------------------------------------------------------------
describe("LoadingSpinner", () => {
    it("should render the loading message", () => {
        render(<LoadingSpinner message="loading data..." />);
        expect(screen.getByText("loading data...")).toBeInTheDocument();
    });
});
