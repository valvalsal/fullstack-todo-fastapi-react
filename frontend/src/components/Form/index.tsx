import { useState } from 'react';

import './style.css';

interface InputOptions {
  value: string;
  label: string;
}

interface BaseFieldProps<T extends object> {
  name: keyof T & string;
  label: string;
}

interface StandardFieldProps<T extends object> extends BaseFieldProps<T> {
  type: 'text' | 'password' | 'checkbox' | 'textarea' | 'email' | 'number';
  options?: never;
}

interface SelectRadioFieldProps<T extends object> extends BaseFieldProps<T> {
  type: 'radio' | 'select';
  options: Array<InputOptions>;
}

type FieldProps<T extends object> =
  | StandardFieldProps<T>
  | SelectRadioFieldProps<T>;

type ChangingElements =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

interface FormProps<T extends object> {
  fields: Array<FieldProps<T>>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  submitButtonText?: string;
  onCancel?: () => void;
  cancelButtonText?: string;
}

function hasOptions<T extends object>(
  field: FieldProps<T>,
): field is SelectRadioFieldProps<T> {
  return field.type === 'select' || field.type === 'radio';
}

const Form = <T extends object>({
  fields,
  initialData,
  onSubmit,
  submitButtonText = 'Submit',
  onCancel,
  cancelButtonText = 'Cancel',
}: FormProps<T>) => {
  const [formData, setFormData] = useState(() => {
    const initialFormData: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initialFormData[field.name] = initialData?.[
          field.name as keyof T
        ] as boolean;
      } else {
        initialFormData[field.name] = String(
          initialData?.[field.name as keyof T] ?? '',
        );
      }
    });
    return initialFormData;
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData as T);
  };

  const handleChange = (e: React.ChangeEvent<ChangingElements>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {fields.map((field) => {
        if (field.type === 'select' && hasOptions(field)) {
          return (
            <div key={field.name} className="select-field">
              <label>
                <span className="field-label">{field.label}</span>
                <select
                  name={field.name}
                  value={String(formData[field.name] ?? '')}
                  onChange={handleChange}
                >
                  {field.options.map((opt) => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        }

        if (field.type === 'radio' && hasOptions(field)) {
          return (
            <div key={field.name} className="radio-field">
              <span className="field-label">{field.label}</span>
              {field.options.map((option) => (
                <label key={option.value}>
                  <input
                    name={field.name}
                    type="radio"
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={handleChange}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="checkbox-field">
              <label>
                <input
                  type="checkbox"
                  name={field.name}
                  checked={Boolean(formData[field.name])}
                  onChange={handleChange}
                />
                <span className="checkbox-label">{field.label}</span>
              </label>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className="textarea-field">
              <label>
                <span className="field-label">{field.label}</span>
                <br />
                <textarea
                  name={field.name}
                  value={String(formData[field.name] ?? '')}
                  onChange={handleChange}
                />
              </label>
            </div>
          );
        }

        return (
          <div key={field.name} className={`${field.type}-field`}>
            <span className="field-label">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={String(formData[field.name] ?? '')}
              onChange={handleChange}
            />
          </div>
        );
      })}
      <div className="form-actions">
        <button type="submit" className="submit">
          {submitButtonText}
        </button>
        {onCancel && (
          <button className="cancel" type="button" onClick={onCancel}>
            {cancelButtonText}
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;
export type { InputOptions, FieldProps };
