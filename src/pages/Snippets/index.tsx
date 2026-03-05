import React, { useEffect, useState } from 'react';
import { Card, Button, message, Popconfirm, Empty, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getSnippets, deleteSnippet } from '../../api/snippets';
import type { Snippet } from '../../api/snippets';
import dayjs from 'dayjs';

const Snippets: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Snippet[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSnippets() as any;
      if (Array.isArray(res)) {
        setList(res);
      } else {
        setList(res.list || []);
      }
    } catch (error) {
      console.error(error);
      message.error('获取列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSnippet(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('删除失败');
    }
  };

  const getSummary = (snippet: Snippet) => {
    if (!snippet.content || snippet.content.length === 0) return '无内容';
    const textBlock = snippet.content.find((b: any) => b.type === 'text');
    if (textBlock && textBlock.type === 'text') {
        return textBlock.content || '无文字内容';
    }
    return '图片/多媒体内容';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white m-0">日常碎片</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="!bg-white/10 hover:!bg-white/20 !border-none !text-white backdrop-blur-sm shadow-none"
          onClick={() => navigate('/snippets/create')}
        >
          发布碎片
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : list.length === 0 ? (
        <Empty description={<span className="text-gray-500">暂无碎片</span>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <Card 
              key={item.id} 
              className="bg-[#121212] border-gray-800 hover:border-gray-700 transition-colors overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              {item.cover ? (
                <div className="h-48 overflow-hidden relative">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                     {dayjs(item.metadata.date || item.createdAt).format('YYYY.MM.DD')}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-[#1f1f1f] flex items-center justify-center relative">
                  <span className="text-gray-600">无封面</span>
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                     {dayjs(item.metadata.date || item.createdAt).format('YYYY.MM.DD')}
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white line-clamp-1 m-0">{item.title}</h3>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 min-h-[60px]">
                  {item.subtitle || getSummary(item)}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex space-x-2 overflow-hidden">
                    {item.tags && item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400 whitespace-nowrap">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex space-x-2 shrink-0">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<EditOutlined />} 
                      className="text-gray-500 hover:text-white"
                      onClick={() => navigate(`/snippets/edit/${item.id}`)}
                    />
                    <Popconfirm 
                      title="确定删除这条碎片吗？" 
                      onConfirm={() => handleDelete(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        type="text" 
                        size="small" 
                        danger
                        icon={<DeleteOutlined />} 
                        className="hover:bg-red-900/20"
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Snippets;
