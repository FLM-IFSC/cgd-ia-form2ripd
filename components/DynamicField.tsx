import React, { useState } from 'react';
// FIX: Import FieldOption to use in the type predicate for `customTriggerOption`.
import type { Field, FormData, CustomEntries, FieldOption } from '../types';
import { PlusIcon, XMarkIcon } from './icons';

interface DynamicFieldProps {
  field: Field;
  stepId: string;
  formData: FormData;
  customEntries: CustomEntries;
  handleInputChange: (stepId: string, fieldId: string, value: string, type: string, specialKey?: string) => void;
  handleCustomAdd: (stepId: string, fieldId: string, value: string) => void;
  handleCustomRemove: (stepId: string, fieldId: string, value: string) => void;
}

export const DynamicField: React.FC<DynamicFieldProps> = React.memo(({ field, stepId, formData, handleInputChange, handleCustomAdd, handleCustomRemove, customEntries }) => {
  const [customValue, setCustomValue] = useState('');

  const fieldData = formData[stepId] || {};
  const fieldValue = fieldData[field.id];
  const customKey = `${stepId}-${field.id}`;
  const customList = customEntries[customKey] || [];
  
  const selectedCheckboxes = (fieldValue as string[]) || [];
  // FIX: Use a type predicate to correctly infer the type of `customTriggerOption` as `FieldOption | undefined`.
  // This resolves the issue where TypeScript couldn't guarantee `customTriggerOption` was an object when accessing `.text`.
  const customTriggerOption = field.options?.find((opt): opt is FieldOption => typeof opt === 'object' && !!opt.isCustomTrigger);
  const showCustomInput = !!customTriggerOption;
  
  const handleSpecialKey = (key: string, type: string) => {
    handleInputChange(stepId, field.id, key, type, key);
  }
  
  const isDisabled = selectedCheckboxes.includes('naoSei') || selectedCheckboxes.includes('precisaAjuda') || selectedCheckboxes.includes('semTestes');

  const renderField = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.id}
            value={(fieldValue as string) || ''}
            onChange={(e) => handleInputChange(stepId, field.id, e.target.value, 'select')}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-ifsc-green focus:border-ifsc-green"
          >
            <option value="">Selecione...</option>
            {field.options?.map(opt => typeof opt === 'string' ? 
              <option key={opt} value={opt}>{opt}</option> :
              <option key={opt.key} value={opt.key}>{opt.text}</option>
            )}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.filter(opt => typeof opt === 'object' && !opt.isCustomTrigger).map(opt => {
              const option = typeof opt === 'string' ? { key: opt, text: opt } : opt;
              return (
                <div key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.id}-${option.key}`}
                    value={option.key}
                    checked={selectedCheckboxes.includes(option.key)}
                    onChange={(e) => handleInputChange(stepId, field.id, e.target.value, 'checkbox')}
                    disabled={isDisabled && !selectedCheckboxes.includes(option.key)}
                    className="h-4 w-4 rounded border-gray-300 text-ifsc-green focus:ring-ifsc-green disabled:opacity-50"
                  />
                  <label htmlFor={`${field.id}-${option.key}`} className={`ml-3 text-sm ${isDisabled && !selectedCheckboxes.includes(option.key) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{option.text}</label>
                </div>
              );
            })}
            {field.unknown && (
               <div key={field.unknown.key} className="flex items-center pt-2 border-t border-dashed dark:border-gray-600 mt-2">
                <input
                  type="checkbox"
                  id={`${field.id}-${field.unknown.key}`}
                  value={field.unknown.key}
                  checked={selectedCheckboxes.includes(field.unknown.key)}
                  onChange={() => handleSpecialKey(field.unknown.key, 'checkbox')}
                  className="h-4 w-4 rounded border-gray-300 text-ifsc-green focus:ring-ifsc-green"
                />
                <label htmlFor={`${field.id}-${field.unknown.key}`} className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{field.unknown.text}</label>
              </div>
            )}
             {field.needsHelp && (
               <div key={field.needsHelp.key} className="flex items-center pt-2 border-t border-dashed dark:border-gray-600 mt-2">
                <input
                  type="checkbox"
                  id={`${field.id}-${field.needsHelp.key}`}
                  value={field.needsHelp.key}
                  checked={selectedCheckboxes.includes(field.needsHelp.key)}
                  onChange={() => handleSpecialKey(field.needsHelp.key, 'checkbox')}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                />
                <label htmlFor={`${field.id}-${field.needsHelp.key}`} className="ml-3 text-sm font-semibold text-amber-600 dark:text-amber-400">{field.needsHelp.text}</label>
              </div>
            )}
          </div>
        );
      case 'radio':
        return (
            <div className="space-y-2">
                {field.options?.map(opt => {
                  const option = typeof opt === 'string' ? { key: opt, text: opt } : opt;
                  return (
                    <div key={option.key} className="flex items-center">
                        <input
                            type="radio"
                            id={`${field.id}-${option.key}`}
                            name={field.id}
                            value={option.key}
                            checked={fieldValue === option.key}
                            onChange={(e) => handleInputChange(stepId, field.id, e.target.value, 'radio')}
                            className="h-4 w-4 border-gray-300 text-ifsc-green focus:ring-ifsc-green"
                        />
                        <label htmlFor={`${field.id}-${option.key}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">{option.text}</label>
                    </div>
                  );
                })}
            </div>
        );
      case 'number':
      case 'text':
        return (
            <input
                type={field.type}
                id={field.id}
                value={(fieldValue as string) || ''}
                onChange={(e) => handleInputChange(stepId, field.id, e.target.value, field.type)}
                placeholder={field.placeholder}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-ifsc-green focus:border-ifsc-green"
            />
        );
      case 'textarea':
         return (
            <textarea
                id={field.id}
                value={(fieldValue as string) || ''}
                onChange={(e) => handleInputChange(stepId, field.id, e.target.value, 'textarea')}
                placeholder={field.placeholder}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-ifsc-green focus:border-ifsc-green"
            />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <label className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
      {renderField()}
      {showCustomInput && (
          <div className="mt-4 pl-4 border-l-2 border-ifsc-green">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">{customTriggerOption?.text || 'Adicionar manually:'}</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyPress={(e) => { if(e.key === 'Enter') { handleCustomAdd(stepId, field.id, customValue); setCustomValue(''); e.preventDefault(); }}}
                  placeholder="Digite e pressione Enter ou '+'"
                  className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button 
                    type="button"
                    onClick={() => { handleCustomAdd(stepId, field.id, customValue); setCustomValue(''); }}
                    className="p-2 bg-ifsc-green text-white rounded-md hover:bg-ifsc-green-dark"
                    aria-label="Adicionar"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                  {customList.map(item => (
                      <span key={item} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-600 text-sm px-2 py-1 rounded-full">
                          {item}
                          <button type="button" onClick={() => handleCustomRemove(stepId, field.id, item)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label={`Remover ${item}`}>
                              <XMarkIcon className="w-4 h-4" />
                          </button>
                      </span>
                  ))}
              </div>
          </div>
      )}
    </div>
  )
});