import React from "react";

interface ErrorDisplayProps {
    message: string;
    onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-red-800">error</p>
                    <p className="text-red-700 text-sm">{message}</p>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-red-600 hover:text-red-800 font-bold text-xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default ErrorDisplay;
