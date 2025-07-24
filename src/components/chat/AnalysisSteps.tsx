import React, { useState } from "react";

// Icons for different step statuses
const CompletedIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const InProgressIcon = () => (
  <svg className="w-6 h-6 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PendingIcon = () => (
  <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

interface StepProps {
  name: string;
  status: "completed" | "in-progress" | "pending";
}

const StepItem: React.FC<StepProps> = ({ name, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return "text-gray-800 dark:text-gray-200";
      case "in-progress":
        return "font-semibold text-brand-500 dark:text-brand-400";
      default:
        return "text-gray-400 dark:text-gray-500";
    }
  };

  return (
    <li className="flex items-center gap-4">
      <div>
        {status === "completed" && <CompletedIcon />}
        {status === "in-progress" && <InProgressIcon />}
        {status === "pending" && <PendingIcon />}
      </div>
      <span className={`text-sm ${getStatusStyles()}`}>{name}</span>
    </li>
  );
};


interface AnalysisStepsProps {
  completedSteps: Set<string>;
  currentStep: string | null;
  onRestart: () => void; // Function to call on button click
  isRestarting: boolean; // Loading state for the button
}

export const AnalysisSteps: React.FC<AnalysisStepsProps> = ({ completedSteps, currentStep, onRestart, isRestarting }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const ALL_STEPS = [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6",
    "Step 7",
  ];

  // Close the dialog if the restart process is finished
  if (!isRestarting && isConfirming) {
    setIsConfirming(false);
  }

  const getStatus = (stepName: string): StepProps["status"] => {
    if (completedSteps.has(stepName)) {
      return "completed";
    }
    if (currentStep === stepName) {
      return "in-progress";
    }
    return "pending";
  };

  return (
    <>
      <div className="hidden lg:block w-1/3">
        <div className="bg-white border rounded-lg shadow-theme-lg dark:bg-gray-dark dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-white">Analysis Progress</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-5">
              {ALL_STEPS.map((step) => (
                <StepItem key={step} name={step} status={getStatus(step)} />
              ))}
            </ul>
          </div>
          <div className="px-6 pt-4 pb-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onRestart}
              disabled={isRestarting}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRestarting ? "Restarting..." : "Restart Analysis"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};