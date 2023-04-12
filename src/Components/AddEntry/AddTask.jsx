import React, { useState } from "react";
import { Table, Input, Button, Space } from "antd";
// import "antd/dist/antd.css";

const { Search } = Input;

const AddTask = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      description: "Buy groceries",
      completed: false
    },
    {
      id: 2,
      description: "Do laundry",
      completed: true
    },
    {
      id: 3,
      description: "Clean room",
      completed: false
    }
  ]);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleAdd = () => {
    const newTodo = {
      id: todos.length + 1,
      description: "",
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleSave = (id, field, value) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, [field]: value } : todo
    );
    setTodos(newTodos);
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleSave(record.id, "description", e.target.value)}
        />
      )
    },
    {
      title: "Completed",
      dataIndex: "completed",
      render: (text, record) => (
        <Input
          type="checkbox"
          checked={text}
          onChange={(e) => handleSave(record.id, "completed", e.target.checked)}
        />
      )
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const filteredTodos = todos.filter((todo) =>
    todo.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h1>Todo List</h1>
      <div style={{ marginBottom: 16 }}>
        <Search placeholder="Search" onChange={handleSearch} />
        <Button type="primary" onClick={handleAdd} style={{ marginLeft: 16 }}>
          Add Todo
        </Button>
      </div>
      <Table dataSource={filteredTodos} columns={columns} />
    </div>
  );
};

export default AddTask;
