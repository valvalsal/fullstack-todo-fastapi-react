import type { AxiosResponse } from 'axios';

import api from '../api';

interface Todo {
  description: string;
  is_done: boolean;
  id: string;
  created_by_id: string;
}

type CreateTodoData = Pick<Todo, 'description'>;

type UpdateTodoData = Partial<Pick<Todo, 'description' | 'is_done'>>;

const updateTodo = async (
  todoId: string,
  updateData: UpdateTodoData,
): Promise<Todo> => {
  const r = await api.put(`/todos/${todoId}`, updateData);
  return r.data;
};

const getTodos = async (): Promise<Array<Todo>> => {
  const r = await api.get('/todos/');
  return r.data;
};

const getTodo = async (todoId: string): Promise<Todo> => {
  const r = await api.get(`/todos/${todoId}`);
  return r.data;
};

const deleteTodo = async (todoId: string): Promise<AxiosResponse<void>> => {
  return await api.delete<void>(`/todos/${todoId}`);
};

const createTodo = async (
  todoData: CreateTodoData,
): Promise<AxiosResponse<Todo>> => {
  return await api.post<Todo>('/todos/', todoData);
};

export { updateTodo, getTodo, getTodos, deleteTodo, createTodo };
export type { Todo, CreateTodoData, UpdateTodoData };
