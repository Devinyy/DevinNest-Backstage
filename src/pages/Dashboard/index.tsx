import React from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Tag, Input, Modal } from 'antd';
import { FileTextOutlined, SnippetsOutlined, PlusOutlined } from '@ant-design/icons';
import { WordCloud } from '@ant-design/plots';

const Dashboard: React.FC = () => {
  // 模拟数据
  const wordCloudData = [
    { text: 'React', value: 100 },
    { text: 'Vue', value: 80 },
    { text: 'Node.js', value: 60 },
    { text: 'TypeScript', value: 70 },
    { text: 'Ant Design', value: 50 },
    { text: 'Next.js', value: 40 },
    { text: 'Vite', value: 55 },
    { text: 'Webpack', value: 30 },
  ];

  const config = {
    data: wordCloudData,
    layout: { spiral: 'rectangular' },
    colorField: 'text',
  };

  // 分类数据
  interface CategoryType {
    key: string;
    name: string;
    count: number;
  }
  
  const categoryData: CategoryType[] = [
    { key: '1', name: '前端开发', count: 45 },
    { key: '2', name: '后端开发', count: 20 },
    { key: '3', name: '随笔', count: 12 },
  ];

  const categoryColumns = [
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '文章数', dataIndex: 'count', key: 'count' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small">删除</Button>
        </Space>
      ),
    },
  ];

  // 标签数据
  interface TagType {
    key: string;
    name: string;
    color: string;
  }

  const tagData: TagType[] = [
    { key: '1', name: 'React', color: 'blue' },
    { key: '2', name: 'TypeScript', color: 'blue' },
    { key: '3', name: 'Life', color: 'green' },
  ];

  const tagColumns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TagType) => <Tag color={record.color}>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small">删除</Button>
        </Space>
      ),
    },
  ];

  const recentArticles = [
    { key: '1', title: '深入理解 React Hooks', date: '2023-10-01' },
    { key: '2', title: 'Node.js 性能优化实战', date: '2023-09-28' },
    { key: '3', title: 'Ant Design 5.0 新特性解析', date: '2023-09-20' },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部统计 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card variant="borderless" className="bg-gray-800">
            <Statistic
              title="博客总数"
              value={112}
              prefix={<FileTextOutlined />}
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="bg-gray-800">
            <Statistic
              title="日常碎片"
              value={28}
              prefix={<SnippetsOutlined />}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 文章概览 */}
      <Card title="文章概览" variant="borderless">
        <Table
          dataSource={recentArticles}
          columns={[
            { title: '标题', dataIndex: 'title', key: 'title' },
            { title: '发布日期', dataIndex: 'date', key: 'date' },
          ]}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 分类与标签管理 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="分类管理" 
            variant="borderless" 
            extra={<Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>}
          >
            <Table 
              columns={categoryColumns} 
              dataSource={categoryData} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="标签管理" 
            variant="borderless"
            extra={<Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>}
          >
            <Table 
              columns={tagColumns} 
              dataSource={tagData} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 词云 */}
      <Row gutter={16}>
        <Col span={24}>
           <Card title="内容词云" variant="borderless">
              <div style={{ height: 400 }}>
                 <WordCloud {...config} />
              </div>
           </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
