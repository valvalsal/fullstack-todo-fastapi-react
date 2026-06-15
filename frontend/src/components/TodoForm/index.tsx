import { useState } from 'react';

import type {
  Todo,
  UpdateTodoData,
  CreateTodoData,
} from '@/services/todoService';

import './style.css';

const initialFormData: CreateTodoData = {
  description: '',
};

interface TodoFormProps<T extends UpdateTodoData | CreateTodoData> {
  itemToEdit?: Todo;
  onSave: (data: T) => void;
  onCancel?: () => void;
}

const TodoForm = <T extends UpdateTodoData | CreateTodoData>({
  itemToEdit,
  onSave,
  onCancel,
}: TodoFormProps<T>) => {
  const [formData, setFormData] = useState(itemToEdit || initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData as T);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="description">Description:</label>{' '}
        <input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
        />
      </div>
      <div className="actions">
        <button className="submit" type="submit">
          Save
        </button>
        {onCancel && (
          <button className="cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
