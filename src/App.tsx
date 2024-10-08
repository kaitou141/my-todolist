import { useState, useEffect } from "react";
import { Button, Modal, List, Radio } from "antd";
import { Todo } from "./types";
import TodoForm from "./TodoForm";
import { getTodos, saveTodos } from "./storage";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const savedTodos = getTodos();
    setTodos(savedTodos);
    setFilteredTodos(savedTodos); // Initially show all todos
  }, []);

  useEffect(() => {
    // Apply filter to todos
    switch (filter) {
      case "new":
        setFilteredTodos(todos.filter((todo) => todo.status === "new"));
        break;
      case "inprogress":
        setFilteredTodos(todos.filter((todo) => todo.status === "inprogress"));
        break;
      case "complete":
        setFilteredTodos(todos.filter((todo) => todo.status === "complete"));
        break;
      default:
        setFilteredTodos(todos);
    }
  }, [filter, todos]);

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

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="mb-4">
        <Radio.Group onChange={handleFilterChange} value={filter}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="new">New</Radio.Button>
          <Radio.Button value="inprogress">In Progress</Radio.Button>
          <Radio.Button value="complete">Completed</Radio.Button>
        </Radio.Group>

        <Button type="primary" onClick={openAddModal} className="mr-2">
          Add Todo
        </Button>
      </div>

      <List
        className="mt-4"
        bordered
        dataSource={filteredTodos}
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
              description={`Description: ${todo.description}, Status: ${todo.status}, Start: ${todo.startDate}, End: ${todo.endDate}`}
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingTodo ? "Edit Todo" : "Add Todo"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTodo(null);
        }}
        footer={null}
      >
        <TodoForm
          initialValues={editingTodo || undefined}
          onSubmit={addOrUpdateTodo}
        />
      </Modal>
    </div>
  );
}

export default App;
