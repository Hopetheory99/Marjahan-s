
import { useState, ChangeEvent } from 'react';

interface ValidationRules {
  required?: boolean;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

type Validations<T> = Partial<Record<keyof T, ValidationRules>>;
type Errors<T> = Partial<Record<keyof T, string>>;

export const useForm = <T extends Record<string, any>>(initialValues: T, validations: Validations<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});

  const validate = (field: keyof T, value: any): string => {
    const rules = validations[field];
    if (!rules) return '';

    if (rules.required && !value) {
      return 'This field is required';
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom && !rules.custom(value)) {
      return 'Invalid value';
    }

    return '';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Clear error on change
    if (errors[name as keyof T]) {
        setErrors({ ...errors, [name]: '' });
    }
  };

  const isValid = () => {
    const newErrors: Errors<T> = {};
    let valid = true;

    for (const key in validations) {
      const error = validate(key, values[key]);
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  return { values, errors, handleChange, isValid };
};
