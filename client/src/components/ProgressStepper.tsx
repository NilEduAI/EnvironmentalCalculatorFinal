interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden md:inline transition-colors ${
                  index <= currentStep ? "text-green-600" : "text-gray-600"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-1 bg-gray-300 ml-2 md:ml-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
