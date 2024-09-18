// src/TodoForm.tsx
import { Form, Input, DatePicker, Select, Button } from 'antd';
import { Todo } from './types';
import moment from 'moment';
import { useEffect } from 'react';

const { Option } = Select;

const TodoForm = ({ initialValues, onSubmit }: { initialValues?: Todo; onSubmit: (values: Todo) => void }) => {
  const [form] = Form.useForm();

  // Use useEffect to update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: moment(initialValues.startDate),
        endDate: moment(initialValues.endDate),
      });
    } else {
      form.resetFields(); // Reset form fields when there's no initial value (e.g., creating a new todo)
    }
  }, [initialValues, form]);
  
  const onFinish = (values: any) => {
    const todo: Todo = {
      ...values,
      id: initialValues?.id || Math.random().toString(),
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };
    onSubmit(todo);
    form.resetFields();
  };

  const validateEndDate = (_ : any, value: moment.Moment | null) => {
    const startDate = form.getFieldValue('startDate');
    if (!startDate || !value) return Promise.resolve();
    return value.isBefore(startDate)
      ? Promise.reject(new Error('End date must be greater than or equal to start date'))
      : Promise.resolve();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
        <Select>
          <Option value="new">New</Option>
          <Option value="inprogress">In Progress</Option>
          <Option value="complete">Complete</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select start date' }]}>
        <DatePicker />
      </Form.Item>

      <Form.Item label="End Date" name="endDate" 
      rules={[
        { required: true, message: 'Please select end date' },
        {validator: validateEndDate}
      ]}>
        <DatePicker />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update Todo' : 'Add Todo'}
        </Button>
      </Form.Item>
    </Form>
    
  );
};

export default TodoForm;
