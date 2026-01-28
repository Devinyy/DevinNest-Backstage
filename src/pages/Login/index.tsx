import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const from = location.state?.from?.pathname || '/';

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // 模拟登录
    if (values.username === 'admin' && values.password === 'admin') {
      messageApi.success('登录成功，正在跳转...');
      login(values.username);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } else {
      messageApi.error('账号或密码错误 (admin/admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {contextHolder}
      
      {/* 背景装饰 - 极简光晕 */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 z-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">DevinNest</h1>
          <p className="text-gray-500">Welcome back to your space.</p>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-500" />} 
              placeholder="Username" 
              className="bg-white/5 border-white/10 text-white placeholder-gray-600 hover:bg-white/10 focus:bg-white/10 focus:border-white/30"
              style={{ padding: '12px 16px' }}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-500" />} 
              placeholder="Password" 
              className="bg-white/5 border-white/10 text-white placeholder-gray-600 hover:bg-white/10 focus:bg-white/10 focus:border-white/30"
              style={{ padding: '12px 16px' }}
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => {
              const username = form.getFieldValue('username');
              const password = form.getFieldValue('password');
              const isReady = !!username && !!password;
              
              return (
                <Button 
                  htmlType="submit" 
                  disabled={!isReady}
                  className={`w-full h-12 border-none font-medium text-base flex items-center justify-center group transition-all duration-300 ${
                    isReady 
                      ? '!bg-blue-600 hover:!bg-blue-500 !text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                      : '!bg-white/10 !text-gray-500 cursor-not-allowed hover:!bg-white/10'
                  }`}
                >
                  Sign In <ArrowRightOutlined className={`ml-2 transition-transform ${isReady ? 'group-hover:translate-x-1' : ''}`} />
                </Button>
              );
            }}
          </Form.Item>
        </Form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          © 2025 DevinNest. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
