import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  title: string;
  category: string;
  tags: string[];
  createdAt: string;
}

const Blogs: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      title: '深入理解 React Hooks',
      category: '前端开发',
      tags: ['React', 'Hooks'],
      createdAt: '2023-10-01',
    },
    {
      key: '2',
      title: 'Node.js 性能优化实战',
      category: '后端开发',
      tags: ['Node.js', 'Performance'],
      createdAt: '2023-09-28',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">博客列表</h2>
        <Button type="primary">新增博客</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Blogs;
