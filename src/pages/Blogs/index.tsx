import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Empty, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { getBlogs, deleteBlog, type Blog } from '../../api/blogs';

const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await getBlogs({
        page,
        pageSize,
      });
      // 适配后端返回结构，如果 res 直接是 list 数组则兼容，如果是 { list, total } 结构则标准处理
      const list = Array.isArray(res) ? res : (res.list || []);
      const totalCount = Array.isArray(res) ? res.length : (res.total || 0);
      
      setData(list);
      setTotal(totalCount);
    } catch (error) {
      console.error('Fetch blogs failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      message.success('删除成功');
      // 如果当前页只有一条数据且不是第一页，删除后向前翻页
      if (data.length === 1 && pagination.current > 1) {
        const newPage = pagination.current - 1;
        setPagination(prev => ({ ...prev, current: newPage }));
        fetchData(newPage);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Delete blog failed:', error);
    }
  };

  const columns: ColumnsType<Blog> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium text-white">{text}</span>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        // category 可能是对象或字符串
        <span>{typeof category === 'object' ? category?.name : category}</span>
      ),
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, record) => {
        // 兼容 tags 对象数组或 tagIds 字符串数组
        const tagsToRender = record.tags || record.tagIds || [];
        return (
          <>
            {tagsToRender.map((tag: any, index: number) => {
              const label = typeof tag === 'string' ? tag : (tag.name || tag.label || 'Tag');
              return (
                <Tag color="blue" key={`${label}-${index}`} className="bg-blue-900/30 text-blue-300 border-blue-800">
                  {label}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span className="text-gray-400">{date ? new Date(date).toLocaleDateString() : '-'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            className="px-0 text-blue-400 hover:text-blue-300"
            onClick={() => navigate(`/blogs/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm 
            title="删除博客"
            description="确定要删除这篇博客吗？此操作不可恢复。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger className="px-0">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">博客列表</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="!bg-white/10 hover:!bg-white/20 !border-none !text-white backdrop-blur-sm shadow-none"
          onClick={() => navigate('/blogs/create')}
        >
          新增博客
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty description={<span className="text-gray-500">暂无博客</span>} />
      ) : (
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            className: "custom-pagination" // 可以在 global css 中定义样式以适配深色模式
          }}
          onChange={handleTableChange}
          className="neo-table"
        />
      )}
    </div>
  );
};

export default Blogs;
