import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Giriş bilgilerini doğrudan kabul et ve add-items sayfasına yönlendir
    message.success('Giriş Yapıldı');
    localStorage.setItem('name', values.name); // Set the username in localStorage
    navigate('/add-items', { state: { userName: values.name } }); // Pass username as state
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Kullanıcı Adı"
        name="name"
        rules={[{ required: true, message: 'Kullanıcı Adı gir' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Şifre"
        name="password"
        rules={[{ required: true, message: 'Şifre gir' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Giriş yap
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
