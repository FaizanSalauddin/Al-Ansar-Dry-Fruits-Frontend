function CheckoutSteps({ currentStep }) {
  const steps = ["cart", "address", "payment"];

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = steps.indexOf(currentStep) > index;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${
                isCompleted
                  ? "bg-green-600 text-white"
                  : isActive
                  ? "border-2 border-green-600 text-green-600"
                  : "border text-gray-400"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            <span className="mx-2 text-sm capitalize text-gray-600">
              {step}
            </span>

            {index < steps.length - 1 && (
              <div className="w-10 h-[2px] bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutSteps;
