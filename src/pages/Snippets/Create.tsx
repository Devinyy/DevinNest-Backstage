import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SendOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CreateSnippet: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // 模拟提交
    setTimeout(() => {
      console.log('Success:', values);
      message.success('碎片发布成功！');
      setLoading(false);
      navigate('/snippets');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto pt-10">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center cursor-pointer group" onClick={() => navigate(-1)}>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
            <ArrowLeftOutlined className="text-gray-400 group-hover:text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white m-0">发布碎片</h1>
        </div>
      </div>

      <Card className="neo-card border-none bg-[#121212]" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: '请输入碎片内容' }]}
            className="mb-6"
          >
            <TextArea 
              placeholder="记录当下的想法..." 
              autoSize={{ minRows: 6, maxRows: 12 }} 
              className="bg-transparent border-none placeholder-gray-600 focus:shadow-none px-0 text-lg !text-gray-300 resize-none"
              bordered={false}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
             <div className="flex space-x-2">
                <Upload showUploadList={false}>
                  <Button 
                    type="text" 
                    icon={<PictureOutlined />} 
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    添加图片
                  </Button>
                </Upload>
             </div>
             
             <Button 
                type="primary" 
                htmlType="submit"
                icon={<SendOutlined />} 
                loading={loading}
                className="bg-amber-600 border-none hover:bg-amber-500 shadow-lg shadow-amber-900/20 px-6"
              >
                发布
              </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSnippet;
