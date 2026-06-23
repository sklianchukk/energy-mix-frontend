import React from "react";

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "loading...",
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
