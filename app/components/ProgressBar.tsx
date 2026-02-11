'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="progress-container">
      <div className="progress-steps">
        <div className="progress-line">
          <div className="progress-line-fill" style={{ width: `${progress}%` }}></div>
        </div>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          let classes = 'step-indicator';

          if (stepNum === currentStep) {
            classes += ' active';
          } else if (stepNum < currentStep) {
            classes += ' completed';
          }

          return (
            <div key={stepNum} className={classes}>
              {stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
