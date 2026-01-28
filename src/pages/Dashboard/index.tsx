import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Tag, Modal, Input, message } from 'antd';
import { FileTextOutlined, SnippetsOutlined, PlusOutlined, ArrowRightOutlined, CloudOutlined, DeleteOutlined, CoffeeOutlined } from '@ant-design/icons';
import { WordCloud } from '@ant-design/plots';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
    theme: 'dark',
    padding: 0,
  };

  // 分类数据
  interface CategoryType {
    key: string;
    name: string;
    count: number;
    icon: React.ReactNode;
    color: string;
  }
  
  const initialCategoryData: CategoryType[] = [
    { key: '1', name: '技术', count: 128, icon: <CloudOutlined />, color: 'bg-blue-500/10 text-blue-500' },
    { key: '2', name: '设计', count: 75, icon: <FileTextOutlined />, color: 'bg-purple-500/10 text-purple-500' },
    { key: '3', name: '生活', count: 92, icon: <SnippetsOutlined />, color: 'bg-green-500/10 text-green-500' },
  ];
  
  const [categories, setCategories] = useState<CategoryType[]>(initialCategoryData);

  // 标签数据
  interface TagType {
    key: string;
    name: string;
    color: string;
  }

  const initialTagData: TagType[] = [
    { key: '1', name: 'React', color: 'blue' },
    { key: '2', name: 'TypeScript', color: 'cyan' },
    { key: '3', name: 'Life', color: 'green' },
    { key: '4', name: 'Design', color: 'purple' },
    { key: '5', name: 'Algorithm', color: 'magenta' },
  ];

  const [tags, setTags] = useState<TagType[]>(initialTagData);

  const getTagColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: '!bg-blue-500/15 !text-blue-400 !border-blue-500/30',
      cyan: '!bg-cyan-500/15 !text-cyan-400 !border-cyan-500/30',
      green: '!bg-emerald-500/15 !text-emerald-400 !border-emerald-500/30',
      purple: '!bg-purple-500/15 !text-purple-400 !border-purple-500/30',
      magenta: '!bg-fuchsia-500/15 !text-fuchsia-400 !border-fuchsia-500/30',
      orange: '!bg-orange-500/15 !text-orange-400 !border-orange-500/30',
      gold: '!bg-amber-500/15 !text-amber-400 !border-amber-500/30',
      lime: '!bg-lime-500/15 !text-lime-400 !border-lime-500/30',
    };
    return colorMap[colorName] || '!bg-gray-500/15 !text-gray-400 !border-gray-500/30';
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const colors = [
      'bg-blue-500/10 text-blue-500',
      'bg-purple-500/10 text-purple-500', 
      'bg-green-500/10 text-green-500',
      'bg-orange-500/10 text-orange-500',
      'bg-pink-500/10 text-pink-500'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newCategory: CategoryType = {
      key: Date.now().toString(),
      name: newCategoryName,
      count: 0,
      icon: <CloudOutlined />,
      color: randomColor
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
    message.success('分类添加成功');
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const colors = ['blue', 'cyan', 'green', 'purple', 'magenta', 'orange', 'gold', 'lime'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTag: TagType = {
      key: Date.now().toString(),
      name: newTagName,
      color: randomColor
    };

    setTags([...tags, newTag]);
    setNewTagName('');
    setIsTagModalOpen(false);
    message.success('标签添加成功');
  };

  const handleDeleteCategory = (key: string) => {
    setCategories(categories.filter(item => item.key !== key));
  };

  const handleDeleteTag = (key: string) => {
    setTags(tags.filter(item => item.key !== key));
  };

  const recentArticles = [
    { key: '1', title: '深入理解 React Hooks', date: '08-31', year: '2025' },
    { key: '2', title: 'Node.js 性能优化实战', date: '03-07', year: '2025' },
    { key: '3', title: '春日短途：山海之间', date: '04-20', year: '2025' },
  ];

  return (
    <div className="space-y-8">
      {/* 顶部统计 - 多彩块风格 */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <div 
            className="neo-card p-6 h-full flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/blogs')}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileTextOutlined style={{ fontSize: '80px', color: '#3b82f6' }} />
            </div>
            <div>
              <div className="text-gray-400 font-medium mb-1">博客总数</div>
              <div className="text-4xl font-bold text-white">112</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
               <span className="text-green-500 flex items-center mr-2 bg-green-500/10 px-2 py-0.5 rounded-full">
                 +5 <ArrowRightOutlined className="rotate-[-45deg] ml-1 text-xs" />
               </span>
               本月新增
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div 
            className="neo-card p-6 h-full flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/snippets')}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CoffeeOutlined style={{ fontSize: '80px', color: '#d97706' }} />
            </div>
            <div>
              <div className="text-gray-400 font-medium mb-1">日常碎片</div>
              <div className="text-4xl font-bold text-white">28</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
               <span className="text-amber-600 flex items-center mr-2 bg-amber-500/10 px-2 py-0.5 rounded-full">
                 +12 <ArrowRightOutlined className="rotate-[-45deg] ml-1 text-xs" />
               </span>
               本月新增
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* 左侧主要内容 */}
        <Col span={16} className="space-y-8">
           {/* 文章概览 */}
           <div className="neo-card p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                   <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                   最新文章
                </h3>
                <Button type="link" className="text-gray-400 hover:text-white" onClick={() => navigate('/blogs')}>查看全部 <ArrowRightOutlined /></Button>
             </div>
             
             <div className="space-y-4">
                {recentArticles.map((article) => (
                   <div key={article.key} className="flex items-center p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="w-16 text-center mr-4">
                         <div className="text-xs text-gray-500">{article.year}</div>
                         <div className="text-lg font-bold text-gray-300 group-hover:text-blue-400 transition-colors">{article.date}</div>
                      </div>
                      <div className="flex-1">
                         <div className="text-base font-medium text-white group-hover:text-blue-400 transition-colors">{article.title}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
                         <ArrowRightOutlined />
                      </div>
                   </div>
                ))}
             </div>
           </div>

           {/* 词云 */}
           <div className="neo-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                   <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                   内容词云
                </h3>
             </div>
              <div style={{ height: 300 }}>
                 <WordCloud {...config} />
              </div>
           </div>
        </Col>

        {/* 右侧侧边栏 */}
        <Col span={8} className="space-y-8">
           {/* 分类管理 */}
           <div className="neo-card p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">分类</h3>
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<PlusOutlined />} 
                  className="bg-white/5 hover:bg-white/10 text-gray-400"
                  onClick={() => setIsCategoryModalOpen(true)}
                />
             </div>
             <div className="space-y-3">
                {categories.map(cat => (
                   <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                            {cat.icon}
                         </div>
                         <span className="text-gray-200 font-medium">{cat.name}</span>
                      </div>
                      <div className="flex items-center">
                         <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded-full group-hover:hidden">{cat.count} 篇</span>
                         <Button 
                            type="text" 
                            danger 
                            size="small" 
                            icon={<DeleteOutlined />} 
                            className="hidden group-hover:flex" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.key); }}
                         />
                      </div>
                   </div>
                ))}
             </div>
           </div>

           {/* 标签管理 */}
           <div className="neo-card p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">热门标签</h3>
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<PlusOutlined />} 
                  className="bg-white/5 hover:bg-white/10 text-gray-400"
                  onClick={() => setIsTagModalOpen(true)}
                />
             </div>
             <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                   <Tag 
                     key={tag.key} 
                     color="default"
                     closable
                     onClose={(e) => { e.preventDefault(); handleDeleteTag(tag.key); }}
                     className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer text-sm m-0 flex items-center hover:opacity-80 ${getTagColorClass(tag.color)}`}
                   >
                     {tag.name}
                   </Tag>
                ))}
                <Tag 
                  className="px-3 py-1.5 rounded-full border-dashed border-gray-700 bg-transparent text-gray-500 hover:text-white hover:border-gray-500 cursor-pointer text-sm m-0"
                  onClick={() => setIsTagModalOpen(true)}
                >
                  + Add
                </Tag>
             </div>
           </div>
           
           {/* 快捷操作 */}
           <div className="neo-card p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/20">
              <h3 className="text-lg font-bold text-white mb-4">写点什么？</h3>
              <p className="text-gray-400 text-sm mb-6">记录当下的想法，或者开始一篇新的技术长文。</p>
              <div className="flex space-x-3">
                 <Button type="primary" size="large" icon={<FileTextOutlined />} className="flex-1 bg-blue-600 hover:bg-blue-500 border-none h-10 rounded-xl font-medium shadow-lg shadow-blue-900/20">
                    写文章
                 </Button>
                 <Button size="large" icon={<SnippetsOutlined />} className="flex-1 bg-white/10 hover:bg-white/20 border-none text-white h-10 rounded-xl font-medium backdrop-blur-sm">
                    发碎片
                 </Button>
              </div>
           </div>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        title="添加分类"
        open={isCategoryModalOpen}
        onOk={handleAddCategory}
        onCancel={() => setIsCategoryModalOpen(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ 
          disabled: !newCategoryName.trim(),
          className: newCategoryName.trim() ? '!bg-blue-600 !text-white hover:!bg-blue-500' : ''
        }}
      >
        <Input 
          placeholder="请输入分类名称" 
          value={newCategoryName} 
          onChange={(e) => setNewCategoryName(e.target.value)} 
          onPressEnter={handleAddCategory}
        />
      </Modal>

      <Modal
        title="添加标签"
        open={isTagModalOpen}
        onOk={handleAddTag}
        onCancel={() => setIsTagModalOpen(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ 
          disabled: !newTagName.trim(),
          className: newTagName.trim() ? '!bg-blue-600 !text-white hover:!bg-blue-500' : ''
        }}
      >
        <Input 
          placeholder="请输入标签名称" 
          value={newTagName} 
          onChange={(e) => setNewTagName(e.target.value)} 
          onPressEnter={handleAddTag}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
