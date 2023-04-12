import React, { useState } from 'react';
import { Table, Input, Button, Space, DatePicker, Tag, Select, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined} from '@ant-design/icons';

const { Option } = Select;

const TodoList = () => {
  const [tasks, setTasks] = useState([]);


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      editable: true,
      render: (title, record) => (
        <Input value={title} onChange={(e) => handleEdit(e.target.value, record.key, 'title')} />
      ), 
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
      render: (description, record) => (
        <Input value={description} onChange={(e) => handleEdit(e.target.value, record.key, 'description')} />
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      editable: true,
      render: (date, record) => <DatePicker value={date}
       onChange={(value) => handleEdit(value, record.key, 'due_date')} />,
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag, record) => (
        <Select value={tag} style={{ width: 120 }}
         onChange={(value) => handleEdit(value, record.key, 'tag')}>
          <Option value="personal">Personal</Option>
          <Option value="work">Work</Option>
          <Option value="shopping">Shopping</Option>
        </Select>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select value={status} style={{ width: 120 }} 
        onChange={(value) => handleEdit(value, record.key, 'status')}>
          <Option value="todo">Open</Option>
          <Option value="inprogress">Working</Option>
          <Option value="done">Done</Option>
          <Option value="done">OverDue</Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        tasks.length >= 1 ? (
          
          <Popconfirm title="Are you sure you want to delete this task?"
           onConfirm={() => handleDelete(record.key)}>
            <Button type="primary" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const addTask = () => {
    setTasks([...tasks, { key: Date.now(), title: '', description: '',
     due_date: null, tag: 'personal', status: 'todo' }]);
  };

  const handleEdit = (value, key, dataIndex) => {
    const newTasks = [...tasks];
    const index = newTasks.findIndex((item) => key === item.key);
    newTasks[index][dataIndex] = value;
    setTasks(newTasks);
  };

  const handleDelete = (key) => {
    const newTasks = tasks.filter((item) => key !== item.key);
    setTasks(newTasks);
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={addTask} icon={<PlusOutlined />} type="primary">
          Add Task
        </Button>
        <Input.Search placeholder="Search Tasks" style={{ width: 200 }} />
      </Space>
      <Table dataSource={tasks} columns={columns} pagination={{ pageSize: 10 }} />
    </>
  );
};

export default TodoList;
