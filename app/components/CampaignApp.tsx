'use client';

import { useState } from 'react';
import ProgressBar from './ProgressBar';
import Card from './Card';
import BackgroundDecoration from './BackgroundDecoration';
import TermsModal from './TermsModal';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

interface UserData {
  nome: string;
  matricula: string;
  setor: string;
}

export default function CampaignApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsCheckbox, setTermsCheckbox] = useState(false);

  const TOTAL_STEPS = 5;

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUserData = (data: UserData) => {
    setUserData(data);
  };

  const handleOpenTerms = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTerms = () => {
    setIsTermsModalOpen(false);
  };

  const handleAcceptTerms = () => {
    setTermsCheckbox(true);
    setIsTermsModalOpen(false);
  };

  const handleCloseForm = () => {
    setCurrentStep(1);
    setUserData(null);
    setTermsCheckbox(false);
    alert('Formulário fechado! Obrigada pela participação. 🌺');
  };

  return (
    <>
      <BackgroundDecoration />
      <div className="container">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <Card>
          {currentStep === 1 && (
            <Step1 onNext={handleNextStep} />
          )}
          {currentStep === 2 && (
            <Step2 onPrev={handlePrevStep} onNext={handleNextStep} />
          )}
          {currentStep === 3 && (
            <Step3
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              onUserData={handleUserData}
            />
          )}
          {currentStep === 4 && (
            <Step4
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              userData={userData}
              onOpenTerms={handleOpenTerms}
            />
          )}
          {currentStep === 5 && (
            <Step5 onClose={handleCloseForm} />
          )}
        </Card>
      </div>
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
      />
    </>
  );
}
