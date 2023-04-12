import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input, DatePicker } from "antd";
import { isEmpty } from "lodash";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DataTable = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState("");
  let [filteredData] = useState();

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true);
    const response = await axios.get("https://jsonplaceholder.typicode.com/comments");
    setGridData(response.data);
    console.log(reset);
    setLoading(false);
  }

  

  // adding reqiured fields to the table not in API => adding Age,
  const DataWithAge = gridData.map((item) => ({
    ...item,
    age: Math.floor(Math.random() * 6) + 20,
  }));



  // modifying  object data => body to message

  const modifiedData = DataWithAge.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    message: isEmpty(body) ? item.message : body
  }))

  // console.log("modifiedData", modifiedData);

  // handleDelete function 
  const handleDelete = (value) => {
    const dataSource = [...modifiedData];
    const filteredData = dataSource.filter((item) => item.id !== value.id);
    setGridData(filteredData);
  }

  // isEditing function 
  const isEditing = (record) => {
    return record.key === editRowKey;
  }


  // cancel function, save, edit
  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...modifiedData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setGridData(newData);
        setEditRowKey("");

      }
    } catch (error) {
      console.log("error", error);
    }

  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      message: "",
      ...record
    });
    setEditRowKey(record.key);
  }

  // sorting function 
  const handleChange = (...sorter) => {
    const { order, field } = sorter[2];
    setSortedInfo({ columnKey: field, order });
  }


  // column search 

  const getColumnSearchProps = (dataIndex) => ({
    filterDropDown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 0, display: "block" }}
        />
        <Space style={{ marginTop: 4 }}>
          <button
            onClick={() =>
              handleSearchCol(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            type='primary'
            size="small"
            styele={{ width: 90 }}
          >
            Search
          </button>
          <button
            onClick={() => handleResetCol(clearFilters)}
            size="small"
            styele={{ width: 90 }}
          >
            Reset
          </button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ?
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchColText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (text)
  })

  //defining handleSearchCol
  const handleSearchCol = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchColText(selectedKeys[0]);
    setSearchedCol(dataIndex);
  }
  // defining HandleResetCol 
  const handleResetCol = (clearFilters) => {
    clearFilters();
    setSearchColText("");
  }
  // defining columns array of objects

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },

    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      editTabale: true,
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTabale: true,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Age",
      dataIndex: "age",
      align: "center",
      editTabale: false,
      sorter: (a, b) => a.age.length - b.age.length,
      sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editTabale: true,
      sorter: (a, b) => a.message.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "message" && sortedInfo.order,
      ...getColumnSearchProps("message"),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1 ? (
          <Space>
            <Popconfirm title="Are you sure want to delete ?"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type='primary' disabled={editable}>
                Delete
              </Button>
            </Popconfirm>
            {editable ? (
              <span>
                <Space size="large">
                  <Button onClick={() => save(record.key)}
                    type='primary' style={{ marginRight: 8 }}>Save</Button>

                  <Popconfirm title="Are you sure want to cancel?" onConfirm={cancel}>
                    <Button>Cancel</Button>
                  </Popconfirm>

                </Space>
              </span>
            ) :
              <Button type='primary' onClick={() => edit(record)} >
                Edit
              </Button>
            }
          </Space>

        ) : null;
      }
    }
  ];



  // addd task
 

  // to get edit fields
  const mergedColumns = columns.map((col) => {
    if (!col.editTabale) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    const input = <Input />;

    return (
      <td {...restProps}>
        {
          editing ? (
            <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{
              required: true,
              message: `please input ${title} field`
            }]}>
              {input}
            </Form.Item>
          ) : (children)
        }
      </td>
    )
  }



  //reset option
  const reset = () => {
    setSortedInfo({});
    setSearchText("");
    loadData();
  }

  // search function 
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      loadData();
    }
  }

  const globalSearch = () => {
    filteredData = modifiedData.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.email.toLowerCase().includes(searchText.toLowerCase()) ||
        value.message.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setGridData(filteredData);
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
      <Button  icon={<PlusOutlined />} type="primary">
          Add Task
        </Button>
        <Input
          placeholder='Enter Search Text'
          onChange={handleInputChange}
          type='text'
          allowClear
          value={searchText}
        />
        <Button onClick={globalSearch} type='primary'>Search</Button>
        <Button onClick={reset}>Reset</Button>
      </Space>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            }
          }}
          dataSource={filteredData && filteredData.length ? filteredData : modifiedData}
          bordered
          loading={loading}
          onChange={handleChange}
          pagination={{ pageSize: 5 }}
        />

      </Form>
    </div>
  )
}

export default DataTable;