import React, { useState } from 'react';
import { WIZARD_STEPS } from './constants/wizardSteps';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DynamicField } from './components/DynamicField';
import { DownloadIcon } from './components/icons';
import { generateDocx, generateCsv } from './utils/reportGenerator';
import type { FormData, CustomEntries } from './types';

const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({});
    const [customEntries, setCustomEntries] = useState<CustomEntries>({});

    const handleInputChange = (stepId: string, fieldId: string, value: string, type: string, specialKey: string | null = null) => {
        setFormData(prev => {
            const newStepData = { ...(prev[stepId] || {}) };
            
            if (type === 'checkbox') {
                const currentValues = (newStepData[fieldId] as string[]) || [];
                if (specialKey && currentValues.includes(specialKey)) {
                     newStepData[fieldId] = currentValues.filter(item => item !== specialKey);
                } else if (specialKey) {
                    newStepData[fieldId] = [specialKey];
                } else {
                    let withoutSpecial = currentValues.filter(item => item !== 'naoSei' && item !== 'precisaAjuda' && item !== 'semTestes');
                    if (withoutSpecial.includes(value)) {
                        newStepData[fieldId] = withoutSpecial.filter(item => item !== value);
                    } else {
                        newStepData[fieldId] = [...withoutSpecial, value];
                    }
                }
            } else {
                newStepData[fieldId] = value;
            }
            return { ...prev, [stepId]: newStepData };
        });
    };
    
    const handleCustomAdd = (stepId: string, fieldId: string, value: string) => {
        if (!value.trim()) return;
        setCustomEntries(prev => {
            const key = `${stepId}-${fieldId}`;
            const currentEntries = prev[key] || [];
            if (!currentEntries.includes(value.trim())) {
                return { ...prev, [key]: [...currentEntries, value.trim()] };
            }
            return prev;
        });
    };

    const handleCustomRemove = (stepId: string, fieldId: string, value: string) => {
        setCustomEntries(prev => {
            const key = `${stepId}-${fieldId}`;
            const currentEntries = prev[key] || [];
            return { ...prev, [key]: currentEntries.filter(entry => entry !== value) };
        });
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleGenerateDocx = () => {
        generateDocx(formData, customEntries);
    };

    const handleGenerateCsv = () => {
        generateCsv(formData, customEntries);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
            <Header />
            
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                         <div className="flex justify-between mb-1">
                            {WIZARD_STEPS.map((step, index) => (
                               <div key={step.id} className={`text-xs text-center w-1/${WIZARD_STEPS.length} ${index <= currentStep ? 'text-ifsc-green font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                                   {step.title}
                               </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div className="bg-ifsc-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentStep) / (WIZARD_STEPS.length - 1)) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {WIZARD_STEPS[currentStep].fields.map(field => {
                             if (field.condition && !field.condition(formData)) return null;
                             return <DynamicField 
                                        key={field.id}
                                        field={field}
                                        stepId={WIZARD_STEPS[currentStep].id}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleCustomAdd={handleCustomAdd}
                                        handleCustomRemove={handleCustomRemove}
                                        customEntries={customEntries}
                                    />
                        })}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                        <button onClick={prevStep} disabled={currentStep === 0} className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            Anterior
                        </button>
                        {currentStep < WIZARD_STEPS.length - 1 ? (
                            <button onClick={nextStep} className="px-6 py-2 bg-ifsc-green hover:bg-ifsc-green-dark text-white rounded-md font-semibold">
                                Próximo
                            </button>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <button onClick={handleGenerateCsv} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center gap-2">
                                   <DownloadIcon className="w-5 h-5"/> Exportar CSV
                                </button>
                                <button onClick={handleGenerateDocx} className="px-6 py-2 bg-ifsc-green hover:bg-ifsc-green-dark text-white rounded-md font-semibold flex items-center gap-2">
                                   <DownloadIcon className="w-5 h-5"/> Gerar Relatório DOCX
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default App;
