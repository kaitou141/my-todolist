import { useState, useEffect } from 'react';
import { Button, Modal, List } from 'antd';
import { Todo } from './types';
import TodoForm from './TodoForm';
import { getTodos, saveTodos } from './storage';
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const savedTodos = getTodos();
    setTodos(savedTodos);
  }, []);

  const addOrUpdateTodo = (todo: Todo) => {
    const updatedTodos = editingTodo
      ? todos.map((t) => (t.id === todo.id ? todo : t))
      : [...todos, todo];

    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setEditingTodo(null);
    setIsModalVisible(false);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  const openAddModal = () => {
    setEditingTodo(null); // Ensure editingTodo is reset when adding a new todo
    setIsModalVisible(true);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <Button type="primary" onClick={openAddModal}>
        Add Todo
      </Button>

      <List
        className="mt-4"
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => openEditModal(todo)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => deleteTodo(todo.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={todo.name}
              description={`Status: ${todo.status}, Start: ${todo.startDate}, End: ${todo.endDate}`}
            />
            <div>{todo.description}</div>
          </List.Item>
        )}
      />

      <Modal
        title={editingTodo ? 'Edit Todo' : 'Add Todo'}
        open={isModalVisible}
        onCancel={() => {setIsModalVisible(false);
          setEditingTodo(null);
        }}
        footer={null}
      >
        <TodoForm initialValues={editingTodo || undefined} onSubmit={addOrUpdateTodo} />
      </Modal>
    </div>
  );
};

export default App
