import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import {
  faTrashCan,
  faPenToSquare,
  faSquare,
  faSquareCheck,
} from '@fortawesome/free-regular-svg-icons';

import { updateTodo, getTodos, deleteTodo } from '@/services/todoService';
import type { Todo } from '@/services/todoService';

import './style.css';

function Home() {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (e) {
        console.error('Error: ', e);
      }
    };

    fetchTodos();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await deleteTodo(id);

      setTimeout(() => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
        setDeletingId(null);
      }, 500);
    } catch (e) {
      console.error('Error: ', e);
      setDeletingId(null);
      alert("Can't delete that todo. Retry later.");
    }
  };

  const handleDoneToggle = async (todo: Todo) => {
    try {
      const newStatus = !todo.is_done;

      const newTodo = await updateTodo(todo.id, {
        is_done: newStatus,
      });

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? newTodo : t)),
      );
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  return (
    <div>
      <h1>
        <FontAwesomeIcon icon={faListCheck} /> My todos
      </h1>
      <div id="container">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`item ${deletingId === todo.id ? 'fade-out' : ''} ${todo.is_done ? 'done' : ''}`}
          >
            <span
              className="action done"
              title={todo.is_done ? 'Mark as not done' : 'Mark as done'}
              onClick={() => handleDoneToggle(todo)}
            >
              <FontAwesomeIcon icon={todo.is_done ? faSquareCheck : faSquare} />
            </span>{' '}
            {todo.description}{' '}
            <span
              className="action edit"
              title="Edit"
              onClick={() => navigate(`/edit/${todo.id}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </span>{' '}
            <span
              className="action delete"
              onClick={() => handleDelete(todo.id)}
              title="Delete item"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
