import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

import { updateTodo, getTodo } from '@/services/todoService';

import TodoForm from '@/components/TodoForm';
import Loader from '@/components/Loader';

import type { Todo, UpdateTodoData } from '@/services/todoService';

function EditTodo() {
  const navigate = useNavigate();
  const { todoId } = useParams<{ todoId: string }>();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!todoId) return;

      try {
        const data = await getTodo(todoId);
        setTodo(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);

        if (axios.isAxiosError(e)) {
          console.error('Error: ', e.response);
          setErrorMessage(e.response?.data.detail || 'An error occured');
        } else {
          console.error('Error: ', e);
          setErrorMessage('An error occured');
        }
      }
    };

    fetchTodo();
  }, [todoId]);

  const onSave = async (data: UpdateTodoData) => {
    if (!todoId) return;

    try {
      await updateTodo(todoId, {
        description: data.description,
      });
      navigate('/');
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const onCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  if (errorMessage) {
    return (
      <div style={{ paddingTop: '1rem' }}>
        <p>{errorMessage}</p>
        <p>
          <a href="/">Go back</a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit todo</h1>
      <TodoForm
        key={todo?.id}
        itemToEdit={todo ?? undefined}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}

export default EditTodo;
