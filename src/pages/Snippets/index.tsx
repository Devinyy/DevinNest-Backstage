import React from 'react';
import { List, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

const data = [
  {
    title: '今天的早餐很棒',
    content: '尝试了新的咖啡豆，味道非常香醇。',
  },
  {
    title: '读完了一本书',
    content: '《黑客与画家》值得一读再读。',
  },
  {
    title: '雨天',
    content: '喜欢下雨天在窗边听歌。',
  },
];

const Snippets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">日常碎片</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="!bg-white/10 hover:!bg-white/20 !border-none !text-white backdrop-blur-sm"
          onClick={() => navigate('/snippets/create')}
        >
          发布碎片
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title} extra={<Button type="link">编辑</Button>}>
              {item.content}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Snippets;
