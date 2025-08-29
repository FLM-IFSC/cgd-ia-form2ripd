export interface FieldOption {
  key: string;
  text: string;
  isCustomTrigger?: boolean;
}

export interface Field {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'radio' | 'text' | 'number' | 'textarea';
  options?: FieldOption[] | string[];
  required?: boolean;
  placeholder?: string;
  condition?: (formData: FormData) => boolean;
  unknown?: { key: string; text: string };
  needsHelp?: { key: string; text: string };
}

export interface WizardStep {
  id: string;
  title: string;
  fields: Field[];
}

export interface FormData {
  [stepId: string]: {
    [fieldId: string]: string | string[];
  };
}

export interface CustomEntries {
  [key: string]: string[];
}
