import { useNavigate } from 'react-router';

import Form from '@/components/Form';

import { createTodo } from '@/services/todoService';

import type { CreateTodoData } from '@/services/todoService';
import type { FieldProps } from '@/components/Form';

const CreateTodo = () => {
  const navigate = useNavigate();

  interface CreateTodoForm {
    description: string;
  }

  const fields: Array<FieldProps<CreateTodoForm>> = [
    { name: 'description', type: 'text', label: 'Description' },
  ];

  const onSave = async (data: CreateTodoData) => {
    try {
      await createTodo(data);
      navigate('/');
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>Create todo</h1>
      <Form fields={fields} onSubmit={onSave} onCancel={onCancel} />
    </div>
  );
};

export default CreateTodo;
