import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Tag, message, Modal, Form, Input, Spin, Space, AutoComplete } from 'antd';
import { 
  FileTextOutlined, 
  PlusOutlined, 
  ArrowRightOutlined, 
  CloudOutlined, 
  DeleteOutlined, 
  CoffeeOutlined, 
  EditOutlined,
  CodeOutlined,
  FormatPainterOutlined,
  SendOutlined,
  ReadOutlined,
  CameraOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { WordCloud } from '@ant-design/plots';
import { getDashboardStats, type DashboardStats } from '../../api/dashboard';
import { 
  getCategories, 
  getTags, 
  deleteCategory, 
  deleteTag, 
  createCategory,
  createTag,
  updateCategory,
  updateTag,
  type Category, 
  type Tag as TagInterface,
  type CreateCategoryParams,
  type CreateTagParams
} from '../../api/taxonomy';
import dayjs from 'dayjs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const iconMap: Record<string, React.ReactNode> = {
    'CodeOutlined': <CodeOutlined />,
    'FormatPainterOutlined': <FormatPainterOutlined />,
    'CoffeeOutlined': <CoffeeOutlined />,
    'SendOutlined': <SendOutlined />,
    'ReadOutlined': <ReadOutlined />,
    'CameraOutlined': <CameraOutlined />,
    'HomeOutlined': <HomeOutlined />,
    'CloudOutlined': <CloudOutlined />
  };

  const iconOptions = [
    { label: '代码', value: 'CodeOutlined', icon: <CodeOutlined /> },
    { label: '画板', value: 'FormatPainterOutlined', icon: <FormatPainterOutlined /> },
    { label: '咖啡', value: 'CoffeeOutlined', icon: <CoffeeOutlined /> },
    { label: '飞机', value: 'SendOutlined', icon: <SendOutlined /> },
    { label: '书籍', value: 'ReadOutlined', icon: <ReadOutlined /> },
    { label: '相机', value: 'CameraOutlined', icon: <CameraOutlined /> },
    { label: '云朵', value: 'CloudOutlined', icon: <CloudOutlined /> },
  ];
  
  const colorOptions = [
    { label: '技术', value: 'bg-blue-500/10 text-blue-500', color: '#3b82f6' },
    { label: '设计', value: 'bg-purple-500/10 text-purple-500', color: '#a855f7' },
    { label: '生活', value: 'bg-orange-500/10 text-orange-500', color: '#f97316' },
    { label: '旅行', value: 'bg-cyan-500/10 text-cyan-500', color: '#06b6d4' },
    { label: '阅读', value: 'bg-amber-500/10 text-amber-500', color: '#f59e0b' },
    { label: '摄影', value: 'bg-emerald-500/10 text-emerald-500', color: '#10b981' },
    { label: '默认', value: 'bg-gray-500/10 text-gray-500', color: '#6b7280' },
  ];

  // 自动映射标签名称到颜色
  const autoColorMap: Record<string, string> = {
    'JavaScript': 'gold',
    'TypeScript': 'blue',
    'Node.js': 'green',
    'React': 'cyan',
    'Vue': 'lime',
    'CSS': 'purple',
    'Python': 'blue',
    'Webpack': 'cyan',
    'AI': 'magenta',
    '算法': 'purple',
    '美食': 'orange',
    '休闲娱乐': 'lime',
    '游戏': 'cyan'
  };

  const [stats, setStats] = useState<DashboardStats>({
    blogsCount: 0,
    snippetsCount: 0,
    categoriesCount: 0,
    tagsCount: 0,
    latestActivity: []
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<TagInterface | null>(null);
  const [categoryForm] = Form.useForm();
  const [tagForm] = Form.useForm();

  // 初始化数据
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [statsRes, categoriesRes, tagsRes] = await Promise.all([
        getDashboardStats(),
        getCategories(),
        getTags()
      ]);
      
      setStats(statsRes);
      setCategories(categoriesRes);
      setTags(tagsRes);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error('获取仪表盘数据失败，请稍后重试');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 转换标签数据为词云格式
  const wordCloudData = tags.map(tag => ({
    text: tag.name,
    value: tag.count || 1, // 如果没有 count，默认为 1
  }));

  const config = {
    data: wordCloudData,
    layout: { spiral: 'rectangular' },
    colorField: 'text',
    theme: 'dark',
    padding: 0,
  };
  
  const getTagColorClass = (colorName?: string, tagName?: string) => {
    const finalColorName = (() => {
      if (colorName) return colorName;
      
      if (tagName) {
        if (autoColorMap[tagName]) return autoColorMap[tagName];
        
        // 如果没有预设映射，则根据标签名生成固定的随机颜色
        const availableColors = ['blue', 'cyan', 'green', 'purple', 'magenta', 'orange', 'gold', 'lime'];
        let hash = 0;
        for (let i = 0; i < tagName.length; i++) {
          hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % availableColors.length;
        return availableColors[index];
      }
      
      return 'blue';
    })();

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
    return colorMap[finalColorName] || '!bg-gray-500/15 !text-gray-400 !border-gray-500/30';
  };

  const handleCategorySubmit = async (values: CreateCategoryParams) => {
    try {
      if (editingCategory) {
        await updateCategory({ ...values, id: editingCategory.id });
        message.success('分类更新成功');
      } else {
        await createCategory(values);
        message.success('分类创建成功');
      }
      setIsCategoryModalVisible(false);
      setEditingCategory(null);
      categoryForm.resetFields();
      // Refresh all data silently
      await fetchData(true);
    } catch (error) {
      console.error('Category operation failed:', error);
      message.error(editingCategory ? '更新分类失败' : '创建分类失败');
    }
  };

  const handleTagSubmit = async (values: CreateTagParams) => {
    try {
      // 如果未选择颜色且在自动映射表中存在，则自动填充颜色
      if (!values.color && autoColorMap[values.name]) {
        values.color = autoColorMap[values.name];
      }

      if (editingTag) {
        await updateTag({ ...values, id: editingTag.id });
        message.success('标签更新成功');
      } else {
        await createTag(values);
        message.success('标签创建成功');
      }
      setIsTagModalVisible(false);
      setEditingTag(null);
      tagForm.resetFields();
      // Refresh all data silently
      await fetchData(true);
    } catch (error) {
      console.error('Tag operation failed:', error);
      message.error(editingTag ? '更新标签失败' : '创建标签失败');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.setFieldsValue({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setIsCategoryModalVisible(true);
  };

  const handleEditTag = (tag: TagInterface) => {
    setEditingTag(tag);
    tagForm.setFieldsValue({
      name: tag.name,
      color: tag.color
    });
    setIsTagModalVisible(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('删除成功');
      // Refresh all data silently
      await fetchData(true);
    } catch (error) {
      console.error('Delete category failed:', error);
      message.error('删除分类失败');
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      message.success('删除成功');
      // Refresh all data silently
      await fetchData(true);
    } catch (error) {
      console.error('Delete tag failed:', error);
      message.error('删除标签失败');
    }
  };

  return (
    <div className="min-h-screen">
      <Spin spinning={loading} size="large" tip="加载数据中...">
        <div className="space-y-8">
          {/* 顶部统计 - 多彩块风格 */}
          <Row gutter={[24, 24]} className="items-stretch">
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
                <div className="text-4xl font-bold text-white mb-2">{stats.blogsCount}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <span className="text-green-500 mr-1 bg-green-500/10 px-1.5 py-0.5 rounded text-xs">+{stats.blogsNewThisMonth || 0}</span>
                  本月新增
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                 <span className="text-green-500 flex items-center mr-2 bg-green-500/10 px-2 py-0.5 rounded-full">
                   <ArrowRightOutlined className="rotate-[-45deg] mr-1 text-xs" /> 
                   View
                 </span>
                 管理博客文章
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
                <div className="text-4xl font-bold text-white mb-2">{stats.snippetsCount}</div>
                <div className="text-sm text-gray-500 flex items-center">
                   <span className="text-amber-500 mr-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">+{stats.snippetsNewThisMonth || 0}</span>
                   本月新增
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                 <span className="text-amber-600 flex items-center mr-2 bg-amber-500/10 px-2 py-0.5 rounded-full">
                   <ArrowRightOutlined className="rotate-[-45deg] mr-1 text-xs" />
                   View
                 </span>
                 记录生活点滴
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* 左侧主要内容 */}
          <Col span={16} className="space-y-8">
             {/* 最新动态 */}
             <div className="neo-card p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center">
                     <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                     最新动态
                  </h3>
               </div>
               <div className="space-y-4">
                  {stats.latestActivity?.map((item) => (
                     <div 
                       key={`${item.type}-${item.id}`} 
                       className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                       onClick={() => navigate(item.type === 'blog' ? `/blogs/edit/${item.id}` : '/snippets')}
                     >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform overflow-hidden ${
                                item.cover 
                                  ? 'bg-transparent'
                                  : item.type === 'blog' 
                                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400' 
                                    : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400'
                              }`}>
                                 {item.cover ? (
                                   <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                                 ) : (
                                   item.type === 'blog' ? <FileTextOutlined /> : <CoffeeOutlined />
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-3 mb-1">
                                   <h4 className={`text-base font-bold truncate transition-colors ${
                                     item.type === 'blog' ? 'text-gray-100 group-hover:text-blue-400' : 'text-gray-100 group-hover:text-amber-400'
                                   }`} title={item.title}>
                                     {item.title}
                                   </h4>
                                   <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
                                     item.type === 'blog' 
                                       ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
                                       : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                   }`}>
                                     {item.type === 'blog' ? 'blog' : 'snippet'}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center text-xs text-gray-500 gap-2">
                                    {/* 分类 */}
                                    {item.category && (
                                      <span className="px-2 py-0.5 rounded border border-gray-700/50 bg-gray-800 text-gray-300">
                                        {item.category.name}
                                      </span>
                                    )}
                                    
                                    {/* 标签 */}
                                    {item.tags && item.tags.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        {item.tags.map(tag => (
                                          <span key={tag.id} className="hover:text-gray-300 transition-colors cursor-pointer">
                                            #{tag.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* 分隔符 & 时间 */}
                                    {(item.category || (item.tags && item.tags.length > 0)) && (
                                       <span className="text-gray-600">·</span>
                                    )}
                                    
                                    <span className="font-mono">
                                       {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        <ArrowRightOutlined className="text-gray-600 group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                     </div>
                  ))}
                  {(!stats.latestActivity || stats.latestActivity.length === 0) && (
                    <div className="text-center text-gray-500 py-8">暂无动态</div>
                  )}
               </div>
             </div>

             {/* 词云 */}
             <div className="neo-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center">
                     <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                     内容分布
                  </h3>
                </div>
                <div className="h-[300px] flex items-center justify-center">
                    {wordCloudData.length > 0 ? (
                      <WordCloud {...config} />
                    ) : (
                      <div className="text-gray-500">暂无标签数据</div>
                    )}
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
                    onClick={() => {
                      setEditingCategory(null);
                      categoryForm.resetFields();
                      setIsCategoryModalVisible(true);
                    }}
                  />
               </div>
               <div className="space-y-3">
                  {categories.map(cat => (
                     <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color || 'bg-gray-500/10 text-gray-500'}`}>
                              {cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : (cat.icon ? <i className={cat.icon} /> : <CloudOutlined />)}
                           </div>
                           <span className="text-gray-200 font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                           <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded-full group-hover:hidden">{cat.count || 0} 篇</span>
                           <div className="hidden group-hover:flex items-center">
                             <Button 
                                type="text" 
                                size="small" 
                                icon={<EditOutlined />} 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 mr-1" 
                                onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}
                             />
                             <Button 
                                type="text" 
                                danger 
                                size="small" 
                                icon={<DeleteOutlined />} 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                             />
                           </div>
                        </div>
                     </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center text-gray-500 py-4">暂无分类</div>
                  )}
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
                    onClick={() => {
                      setEditingTag(null);
                      tagForm.resetFields();
                      setIsTagModalVisible(true);
                    }}
                  />
               </div>
               <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                     <Tag 
                        key={tag.id} 
                        className={`!flex !flex-wrap px-3 py-1.5 rounded-lg border-0 text-sm cursor-pointer transition-all hover:scale-105 flex items-center group ${getTagColorClass(tag.color, tag.name)}`}
                     >
                        <span>{tag.name}</span>
                        <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] group-hover:ml-2 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 flex items-center whitespace-nowrap">
                          <EditOutlined className="text-xs hover:text-blue-400 mr-2" onClick={(e) => { e.stopPropagation(); handleEditTag(tag); }} />
                          <DeleteOutlined className="text-xs hover:text-red-400" onClick={(e) => { e.stopPropagation(); handleDeleteTag(tag.id); }} />
                        </span>
                     </Tag>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-center text-gray-500 w-full py-4">暂无标签</div>
                  )}
               </div>
             </div>
          </Col>
        </Row>
        </div>

        {/* Add/Edit Category Modal */}
        <Modal
          title={editingCategory ? "编辑分类" : "添加分类"}
          open={isCategoryModalVisible}
          onCancel={() => {
            setIsCategoryModalVisible(false);
            setEditingCategory(null);
            categoryForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={categoryForm}
            onFinish={handleCategorySubmit}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="分类名称"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder="例如：技术分享" />
            </Form.Item>
            <Form.Item
              name="icon"
              label="图标"
              tooltip="支持选择预设图标，或输入自定义 CSS Class (如: ri-home-line)"
            >
              <AutoComplete
                placeholder="选择或输入图标 Class"
                allowClear
                filterOption={(inputValue, option) => {
                  const opt = iconOptions.find(o => o.value === option?.value);
                  const searchStr = opt ? `${opt.value} ${opt.label}` : option?.value || '';
                  return searchStr.toUpperCase().includes(inputValue.toUpperCase());
                }}
                options={iconOptions.map(opt => ({
                  value: opt.value,
                  label: (
                    <Space>
                      {opt.icon}
                      {opt.label}
                    </Space>
                  )
                }))}
              />
            </Form.Item>
            <Form.Item
              name="color"
              label="颜色主题"
              tooltip="支持选择预设颜色，或输入自定义 Tailwind Class"
            >
              <AutoComplete
                placeholder="选择或输入 Tailwind Class"
                allowClear
                filterOption={(inputValue, option) => {
                  const opt = colorOptions.find(o => o.value === option?.value);
                  const searchStr = opt ? `${opt.value} ${opt.label}` : option?.value || '';
                  return searchStr.toUpperCase().includes(inputValue.toUpperCase());
                }}
                options={colorOptions.map(opt => ({
                  value: opt.value,
                  label: (
                    <Space>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: opt.color }} />
                      {opt.label}
                    </Space>
                  )
                }))}
              />
            </Form.Item>
            <Form.Item className="mb-0 text-right">
              <Button onClick={() => {
                setIsCategoryModalVisible(false);
                setEditingCategory(null);
                categoryForm.resetFields();
              }} className="mr-2">取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Add/Edit Tag Modal */}
        <Modal
          title={editingTag ? "编辑标签" : "添加标签"}
          open={isTagModalVisible}
          onCancel={() => {
            setIsTagModalVisible(false);
            setEditingTag(null);
            tagForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={tagForm}
            onFinish={handleTagSubmit}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="标签名称"
              rules={[{ required: true, message: '请输入标签名称' }]}
            >
              <Input placeholder="例如：React" />
            </Form.Item>
            <Form.Item
              name="color"
              label="颜色"
            >
               <Input placeholder="例如：blue, red, green..." />
            </Form.Item>
            <Form.Item className="mb-0 text-right">
               <Button onClick={() => {
                 setIsTagModalVisible(false);
                 setEditingTag(null);
                 tagForm.resetFields();
               }} className="mr-2">取消</Button>
               <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default Dashboard;