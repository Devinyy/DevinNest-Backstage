import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, Card, Tag, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // 模拟提交
    setTimeout(() => {
      console.log('Success:', values);
      message.success('博客发布成功！');
      setLoading(false);
      navigate('/blogs');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center cursor-pointer group" onClick={() => navigate(-1)}>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
            <ArrowLeftOutlined className="text-gray-400 group-hover:text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white m-0">写文章</h1>
        </div>
        <div className="flex space-x-3">
          <Button 
            icon={<SaveOutlined />} 
            className="bg-white/5 border-none text-gray-400 hover:text-white hover:bg-white/10"
          >
            存草稿
          </Button>
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            loading={loading}
            onClick={() => form.submit()}
            className="bg-blue-600 border-none hover:bg-blue-500 shadow-lg shadow-blue-900/20"
          >
            发布
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主要编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="neo-card border-none bg-[#121212]" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ visibility: 'public' }}
            >
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
                className="mb-6"
              >
                <Input 
                  placeholder="请输入文章标题..." 
                  className="text-2xl font-bold bg-transparent border-none placeholder-gray-600 focus:shadow-none px-0 py-2 !text-white"
                  bordered={false} 
                />
              </Form.Item>

              <Form.Item
                name="content"
                rules={[{ required: true, message: '请输入文章内容' }]}
              >
                <TextArea 
                  placeholder="开始你的创作..." 
                  autoSize={{ minRows: 20 }} 
                  className="bg-transparent border-none placeholder-gray-600 focus:shadow-none px-0 text-lg !text-gray-300 resize-none"
                  bordered={false}
                />
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* 右侧设置区 */}
        <div className="space-y-6">
          <Card title={<span className="text-white">发布设置</span>} className="neo-card border-none bg-[#121212]" bordered={false}>
            <Form form={form} layout="vertical" component={false}>
              <Form.Item label={<span className="text-gray-400">分类</span>} name="category" className="mb-4">
                <Select 
                  placeholder="选择分类" 
                  className="custom-select"
                  popupClassName="bg-[#1f1f1f] border border-gray-800"
                >
                  <Option value="tech">技术</Option>
                  <Option value="design">设计</Option>
                  <Option value="life">生活</Option>
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-gray-400">标签</span>} name="tags" className="mb-4">
                <Select
                  mode="tags"
                  placeholder="输入标签"
                  className="custom-select"
                  popupClassName="bg-[#1f1f1f] border border-gray-800"
                >
                  <Option value="react">React</Option>
                  <Option value="typescript">TypeScript</Option>
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-gray-400">封面图</span>} name="cover" className="mb-4">
                <Upload.Dragger 
                  name="files" 
                  action="/upload.do" 
                  className="bg-white/5 border-dashed border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined className="text-gray-500" />
                  </p>
                  <p className="text-gray-400 text-sm">点击或拖拽上传封面</p>
                </Upload.Dragger>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
