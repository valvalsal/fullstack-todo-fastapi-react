import { useNavigate } from 'react-router';

import TodoForm from '@/components/TodoForm';
import { createTodo } from '@/services/todoService';

import type { CreateTodoData } from '@/services/todoService';

function CreateTodo() {
  const navigate = useNavigate();

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
      <TodoForm onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

export default CreateTodo;
