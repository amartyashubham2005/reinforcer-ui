import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "../../icons";

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


  const ALL_STEPS = [
    { name: "Step 1 - Specify Performance", description: "Here you clarify the entire mission. First, you settle on a single result the business genuinely cares about—something measurable, time-boxed, and tied to strategy. Then you translate that result into one plainly visible behaviour that brings it to life on the front line. When this step is complete, everyone involved can point to the same target and the same action, eliminating guesswork before deeper analysis begins." },
    { name: "Step 2 - Measure Performance", description: "With the target behaviour named, you now establish reality. Install a simple way to count how often the target behaviour happens now and record a full cycle of data. This baseline becomes the reference point for every improvement claim that follows." },
    { name: "Step 3 - ABC Analysis", description: "The detective work starts here. You examine real episodes of the behaviour, noting what consistently happens just beforehand, the behaviour itself, and whatever benefit or relief follows seconds later. Collecting these ABC chains—through brief observations or interviews—reveals the real forces sustaining or blocking performance. A clear causal map emerges, ready to guide intervention design." },
    { name: "Step 4 - Design Feedback", description: "Once causes are understood, attention turns to continuous feedback. Raw counts from Steps 2 and 3 are distilled into a concise display that teammates can grasp at a glance and see on a reliable schedule. Visibility creates self-correction; when progress is obvious, teams adjust on their own." },
    { name: "Step 5 - Set sub-goals", description: "Immediate, meaningful positives are attached to the desired behaviour, while unnoticed perks that follow the undesired one are quietly removed. Subtle prompts or checklists may also be introduced to make the preferred action the path of least resistance. The aim is to tilt day-to-day contingencies so the preferred action is also the easiest." },
    { name: "Step 6 - Plan rewards/recognition", description: "Interventions run, data flows, and the feedback display begins to shift—or not. Compare fresh data to the baseline, keep what lifts the line, and adjust quickly when it stalls. Treat every change as a micro-experiment and log the outcome to build a living playbook." },
    { name: "Step 7 - Sustain & generalise", description: "Finally, the patterns that proved effective are woven into routine workflows, dashboards, and policies so results endure beyond individual champions or team turnover. An explicit owner keeps the system healthy, and the documented playbook is shared so other units can replicate success with minimal ramp-up. Sustainability and transferability mark the true close of the cycle." }
  ];

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
    // Reset expanded step when currentStep changes
    if (currentStep) {
      setExpandedStep(currentStep);
    }
  }, [currentStep]);
  
  return (
    <div className="space-y-3 w-full max-w-2xl">
      {ALL_STEPS.map((step) => {
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
                <div className="font-semibold text-lg text-gray-900 dark:text-white">{step.name}</div>
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