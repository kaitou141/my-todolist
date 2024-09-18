import { Todo } from './types';

const TODOS_KEY = 'todos';

export const getTodos = (): Todo[] => {
  const data = localStorage.getItem(TODOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};