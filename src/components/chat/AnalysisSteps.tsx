import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "../../icons";
import { abcService } from "../../services/abc";

interface StepProps {
  name: string;
  description: string;
  status: "confirmed" | "current" | "disabled";
}

interface AnalysisStepsProps {
  completedSteps: Set<string>;
  currentStep: string | null;
  onRestart: () => void;
  isRestarting: boolean;
}

export const AnalysisSteps: React.FC<AnalysisStepsProps> = ({
  completedSteps,
  currentStep,
  onRestart,
  isRestarting,
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<{ name: string; description: string }[]>([]);

  // Fetch all steps from API on component mount
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await abcService.getAllSteps();
        if (response.ok) {
          setAllSteps(response.data);
        } else {
          console.error("Failed to fetch analysis steps");
        }
      } catch (error) {
        console.error("Error fetching analysis steps:", error);
      }
    };
    fetchSteps();
  }, []);

  // Load expanded state from localStorage on mount
  useEffect(() => {
    const savedExpandedStep = localStorage.getItem('expandedAnalysisStep');
    if (savedExpandedStep) {
      setExpandedStep(savedExpandedStep);
    }
  }, []);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    if (expandedStep) {
      localStorage.setItem('expandedAnalysisStep', expandedStep);
    } else {
      localStorage.removeItem('expandedAnalysisStep');
    }
  }, [expandedStep]);

  const getStatus = (stepName: string): StepProps["status"] => {
    if (completedSteps.has(stepName)) {
      return "confirmed";
    }
    if (currentStep === stepName) {
      return "current";
    }
    return "disabled";
  };

  const getStatusDisplay = (status: StepProps["status"]): React.ReactNode => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "current":
        return "Current";
      case "disabled":
        return (
          <span className="flex items-center space-x-1">
            <img
              src={document.documentElement.classList.contains('dark') ? '/images/icons/lock-dark.svg' : '/images/icons/lock.svg'}
              alt="Lock Icon"
              className="h-4 w-4"
            />
            <span>Disabled</span>
          </span>
        );

      default:
        return status;
    }
  };

  const toggleAccordion = (stepName: string) => {
    const status = getStatus(stepName);
    // Don't toggle if step is disabled
    if (status === "disabled") return;
    
    setExpandedStep(expandedStep === stepName ? null : stepName);
  };

  useEffect(() => {
    // Auto-expand current step if no step is currently expanded or if current step changed
    if (currentStep && (!expandedStep || currentStep !== expandedStep)) {
      setExpandedStep(currentStep);
    }
  }, [currentStep, expandedStep]);
  
  return (
    <div className="space-y-3 w-full max-w-2xl">
      {allSteps.map((step) => {
        const status = getStatus(step.name);
        const isExpanded = expandedStep === step.name;
        const isDisabled = status === "disabled";
  
        return (
          <div
            key={step.name}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm bg-white dark:bg-gray-dark hover:shadow-md transition-all duration-300 ease-in-out w-full"
          >
            <div
              className={`flex justify-between items-center ${!isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => !isDisabled && toggleAccordion(step.name)}
            >
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{step.name}</div>
                <div className={`text-sm font-medium text-gray-400 dark:text-gray-500`}>
                  {getStatusDisplay(status)}
                </div>
              </div>
              {!isDisabled && (
                <div className="ml-4">
                  <div className={`transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
            {!isDisabled && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Restart Button */}
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onRestart}
        disabled={isRestarting}
        className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {isRestarting ? "Restarting Analysis..." : "🔄 Restart Analysis"}
      </button>
    </div>
    </div>
  );
};