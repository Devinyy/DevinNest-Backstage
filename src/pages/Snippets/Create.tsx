import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message, Select, DatePicker, Space, Divider, Tooltip, Row, Col, Typography, Modal } from 'antd';
import { 
  ArrowLeftOutlined, 
  SendOutlined, 
  SaveOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  UpOutlined, 
  DownOutlined, 
  PictureOutlined, 
  FontSizeOutlined, 
  AppstoreOutlined, 
  BuildOutlined,
  CloudUploadOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CloudOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

// --- Interfaces ---

interface BaseBlock {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'quote';
}

interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  caption?: string;
  exif?: string;
  layout?: 'normal' | 'bleed' | 'portrait';
  file?: UploadFile; // For local preview
}

interface GalleryImage {
  src: string;
  exif?: string;
  file?: UploadFile; // For local preview
}

interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  layout: 'grid-2' | 'grid-3';
  images: GalleryImage[];
  caption?: string;
}

interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
}

type Block = TextBlock | ImageBlock | GalleryBlock | QuoteBlock;

// --- Helper Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const mockUpload = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    setTimeout(() => resolve(url), 500);
  });
};

// --- Block Editors ---

const BlockWrapper: React.FC<{
  block: Block;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ block, onDelete, onMoveUp, onMoveDown, isFirst, isLast, title, icon, children }) => {
  return (
    <Card 
      className="mb-4 bg-[#1f1f1f] border border-gray-800 hover:border-gray-700 transition-colors" 
      bodyStyle={{ padding: '16px' }}
      hoverable
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-gray-400">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<UpOutlined />} 
            disabled={isFirst} 
            onClick={onMoveUp}
            className="text-gray-500 hover:text-white"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DownOutlined />} 
            disabled={isLast} 
            onClick={onMoveDown}
            className="text-gray-500 hover:text-white"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />} 
            danger 
            onClick={onDelete}
            className="hover:bg-red-900/20"
          />
        </Space>
      </div>
      {children}
    </Card>
  );
};

const TextBlockEditor: React.FC<{ block: TextBlock; onChange: (b: TextBlock) => void }> = ({ block, onChange }) => {
  return (
    <TextArea
      value={block.content}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      placeholder="输入正文内容..."
      autoSize={{ minRows: 3 }}
      className="bg-[#121212] border-gray-800 text-gray-300 placeholder-gray-600"
    />
  );
};

const ImageBlockEditor: React.FC<{ block: ImageBlock; onChange: (b: ImageBlock) => void }> = ({ block, onChange }) => {
  const handleUpload = async (file: File) => {
    const url = await mockUpload(file);
    onChange({ ...block, src: url, file: file as any });
    return false;
  };

  return (
    <div className="space-y-4">
      {!block.src ? (
        <Upload.Dragger
          showUploadList={false}
          beforeUpload={handleUpload}
          className="bg-[#121212] border-gray-800"
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined className="text-gray-600" />
          </p>
          <p className="text-gray-500">点击或拖拽上传图片</p>
        </Upload.Dragger>
      ) : (
        <div className="relative group">
          <img src={block.src} alt="Preview" className="w-full h-48 object-cover rounded bg-[#121212]" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload showUploadList={false} beforeUpload={handleUpload}>
              <Button type="primary" size="small">更换图片</Button>
            </Upload>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input 
          prefix={<FontSizeOutlined className="text-gray-600" />}
          placeholder="图片说明 (Caption)" 
          value={block.caption} 
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          className="bg-[#121212] border-gray-800 text-gray-300"
        />
        <Input 
          prefix={<CameraOutlined className="text-gray-600" />}
          placeholder="EXIF (e.g. f/2.8 · 1/1000s)" 
          value={block.exif} 
          onChange={(e) => onChange({ ...block, exif: e.target.value })}
          className="bg-[#121212] border-gray-800 text-gray-300"
        />
      </div>
      <Select 
        value={block.layout || 'normal'} 
        onChange={(val) => onChange({ ...block, layout: val })}
        className="w-full custom-select"
        popupClassName="bg-[#1f1f1f]"
      >
        <Option value="normal">默认布局 (Normal)</Option>
        <Option value="bleed">通栏布局 (Bleed)</Option>
        <Option value="portrait">竖向布局 (Portrait)</Option>
      </Select>
    </div>
  );
};

const GalleryBlockEditor: React.FC<{ block: GalleryBlock; onChange: (b: GalleryBlock) => void }> = ({ block, onChange }) => {
  const handleAddImage = async (file: File) => {
    const url = await mockUpload(file);
    const newImages = [...block.images, { src: url, file: file as any }];
    onChange({ ...block, images: newImages });
    return false;
  };

  const updateImageExif = (index: number, exif: string) => {
    const newImages = [...block.images];
    newImages[index].exif = exif;
    onChange({ ...block, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = block.images.filter((_, i) => i !== index);
    onChange({ ...block, images: newImages });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {block.images.map((img, idx) => (
          <div key={idx} className="relative bg-[#121212] p-2 rounded border border-gray-800">
            <img src={img.src} alt="" className="w-full h-32 object-cover rounded mb-2" />
            <Input 
              size="small" 
              placeholder="EXIF Info" 
              value={img.exif}
              onChange={(e) => updateImageExif(idx, e.target.value)}
              className="bg-[#1f1f1f] border-gray-700 text-gray-300 text-xs mb-1"
            />
            <Button 
              type="text" 
              danger 
              size="small" 
              icon={<DeleteOutlined />} 
              className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white"
              onClick={() => removeImage(idx)}
            />
          </div>
        ))}
        <Upload 
          showUploadList={false} 
          beforeUpload={handleAddImage}
          className="bg-[#121212] border border-dashed border-gray-700 rounded flex flex-col items-center justify-center h-full min-h-[160px] hover:border-blue-500 cursor-pointer transition-colors"
        >
          <div className="text-center p-4">
            <PlusOutlined className="text-gray-500 text-xl mb-2" />
            <div className="text-gray-500 text-sm">添加图片</div>
          </div>
        </Upload>
      </div>
      
      <Input 
        prefix={<FontSizeOutlined className="text-gray-600" />}
        placeholder="图集说明 (Caption)" 
        value={block.caption} 
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        className="bg-[#121212] border-gray-800 text-gray-300"
      />
      <Select 
        value={block.layout} 
        onChange={(val) => onChange({ ...block, layout: val })}
        className="w-full custom-select"
        popupClassName="bg-[#1f1f1f]"
      >
        <Option value="grid-2">双列布局 (Grid-2)</Option>
        <Option value="grid-3">三列布局 (Grid-3)</Option>
      </Select>
    </div>
  );
};

const QuoteBlockEditor: React.FC<{ block: QuoteBlock; onChange: (b: QuoteBlock) => void }> = ({ block, onChange }) => {
  return (
    <div className="space-y-4">
      <TextArea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="输入引用内容..."
        autoSize={{ minRows: 2 }}
        className="bg-[#121212] border-gray-800 text-gray-300 italic"
      />
      <Input 
        prefix={<span className="text-gray-600">—</span>}
        placeholder="作者 / 出处" 
        value={block.author} 
        onChange={(e) => onChange({ ...block, author: e.target.value })}
        className="bg-[#121212] border-gray-800 text-gray-300"
      />
    </div>
  );
};

// --- Main Component ---

const CreateSnippet: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [canPublish, setCanPublish] = useState(false);

  // Form Value Watcher
  const handleValuesChange = (_: any, allValues: any) => {
    const hasTitle = !!allValues.title?.trim();
    const hasBlocks = blocks.length > 0;
    // 简单校验：标题必填，至少有一个内容块
    setCanPublish(hasTitle && hasBlocks);
  };

  // Update blocks validation when blocks change
  React.useEffect(() => {
    const title = form.getFieldValue('title');
    setCanPublish(!!title?.trim() && blocks.length > 0);
  }, [blocks, form]);

  const handleAddBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      ...(type === 'text' ? { content: '' } : {}),
      ...(type === 'image' ? { src: '' } : {}),
      ...(type === 'gallery' ? { layout: 'grid-2', images: [] } : {}),
      ...(type === 'quote' ? { content: '' } : {}),
    } as Block;
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (index: number, newBlock: Block) => {
    const newBlocks = [...blocks];
    newBlocks[index] = newBlock;
    setBlocks(newBlocks);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const onFinish = (values: any) => {
    setLoading(true);

    const finalData = {
      id: "daily" + generateId(), // 模拟 ID
      title: values.title,
      subtitle: values.subtitle,
      cover: coverUrl,
      date: values.date ? values.date.format('YYYY.MM.DD') : dayjs().format('YYYY.MM.DD'),
      location: values.location,
      weather: values.weather,
      camera: values.camera,
      tags: values.tags,
      content: blocks
    };

    console.log('Final Snippet Data:', JSON.stringify(finalData, null, 2));

    setTimeout(() => {
      message.success('碎片发布成功！');
      setLoading(false);
      navigate('/snippets');
    }, 1000);
  };

  const handleCoverUpload = async (file: File) => {
    const url = await mockUpload(file);
    setCoverUrl(url);
    return false;
  };

  return (
    <div className="w-full px-6 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
        <div className="flex items-center cursor-pointer group" onClick={() => navigate(-1)}>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
            <ArrowLeftOutlined className="text-gray-400 group-hover:text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white m-0">记录碎片</h1>
        </div>
        <div className="flex space-x-3">
          <Button 
            icon={<SaveOutlined />} 
            className="bg-white/5 border-none text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => message.info('暂未开放')}
          >
            存草稿
          </Button>
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            loading={loading}
            onClick={() => form.submit()}
            disabled={!canPublish}
            className={`border-none shadow-lg transition-all ${
              canPublish 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 text-white' 
                : 'bg-white/5 text-gray-500 shadow-none cursor-not-allowed hover:bg-white/5'
            }`}
          >
            发布
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* 左侧：基本信息 */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="neo-card border-none bg-[#121212] sticky top-24" bordered={false} title={<span className="text-white">基本信息</span>}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={handleValuesChange}
              initialValues={{ date: dayjs() }}
            >
              <Form.Item name="title" label={<span className="text-gray-400">标题</span>} rules={[{ required: true }]}>
                <Input placeholder="输入标题..." className="bg-[#1f1f1f] border-gray-800 text-white" />
              </Form.Item>
              
              <Form.Item name="subtitle" label={<span className="text-gray-400">副标题 (Subtitle)</span>}>
                <Input placeholder="输入副标题..." className="bg-[#1f1f1f] border-gray-800 text-white" />
              </Form.Item>

              <Form.Item label={<span className="text-gray-400">封面图</span>}>
                 <Upload.Dragger 
                    showUploadList={false}
                    beforeUpload={handleCoverUpload}
                    className="bg-[#1f1f1f] border-dashed border-gray-700 hover:border-blue-500 transition-colors group"
                  >
                    {coverUrl ? (
                      <div className="relative w-full h-32 overflow-hidden rounded">
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white">更换封面</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <CloudUploadOutlined className="text-2xl text-gray-600 mb-2" />
                        <p className="text-gray-500 text-xs">上传封面</p>
                      </div>
                    )}
                  </Upload.Dragger>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="date" label={<span className="text-gray-400">日期</span>}>
                  <DatePicker className="w-full bg-[#1f1f1f] border-gray-800 text-white" suffixIcon={<CalendarOutlined className="text-gray-500" />} />
                </Form.Item>
                <Form.Item name="weather" label={<span className="text-gray-400">天气</span>}>
                  <Input prefix={<CloudOutlined className="text-gray-600" />} placeholder="晴 · 25°C" className="bg-[#1f1f1f] border-gray-800 text-white" />
                </Form.Item>
              </div>

              <Form.Item name="location" label={<span className="text-gray-400">地点</span>}>
                <Input prefix={<EnvironmentOutlined className="text-gray-600" />} placeholder="城市 · 地标" className="bg-[#1f1f1f] border-gray-800 text-white" />
              </Form.Item>

              <Form.Item name="camera" label={<span className="text-gray-400">拍摄设备</span>}>
                <Input prefix={<CameraOutlined className="text-gray-600" />} placeholder="相机型号 / 镜头" className="bg-[#1f1f1f] border-gray-800 text-white" />
              </Form.Item>

              <Form.Item name="tags" label={<span className="text-gray-400">标签</span>}>
                <Select 
                  mode="tags" 
                  placeholder="输入标签" 
                  className="custom-select" 
                  popupClassName="bg-[#1f1f1f]"
                  suffixIcon={<TagOutlined className="text-gray-500" />}
                >
                  <Option value="旅行">旅行</Option>
                  <Option value="摄影">摄影</Option>
                  <Option value="生活">生活</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* 右侧：内容积木 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] rounded-lg p-6 min-h-[600px] border border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white m-0">内容详情</h2>
              <span className="text-gray-500 text-sm">已添加 {blocks.length} 个模块</span>
            </div>

            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 rounded-lg bg-[#1f1f1f]/30">
                <BuildOutlined className="text-4xl text-gray-700 mb-4" />
                <p className="text-gray-500">点击下方按钮添加内容模块</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <BlockWrapper
                    key={block.id}
                    block={block}
                    title={
                      block.type === 'text' ? '文本段落' :
                      block.type === 'image' ? '单张图片' :
                      block.type === 'gallery' ? '图片组 (Gallery)' : '引用 (Quote)'
                    }
                    icon={
                      block.type === 'text' ? <FontSizeOutlined /> :
                      block.type === 'image' ? <PictureOutlined /> :
                      block.type === 'gallery' ? <AppstoreOutlined /> : <BuildOutlined />
                    }
                    onDelete={() => handleRemoveBlock(index)}
                    onMoveUp={() => handleMoveBlock(index, 'up')}
                    onMoveDown={() => handleMoveBlock(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                  >
                    {block.type === 'text' && (
                      <TextBlockEditor block={block as TextBlock} onChange={(b) => handleUpdateBlock(index, b)} />
                    )}
                    {block.type === 'image' && (
                      <ImageBlockEditor block={block as ImageBlock} onChange={(b) => handleUpdateBlock(index, b)} />
                    )}
                    {block.type === 'gallery' && (
                      <GalleryBlockEditor block={block as GalleryBlock} onChange={(b) => handleUpdateBlock(index, b)} />
                    )}
                    {block.type === 'quote' && (
                      <QuoteBlockEditor block={block as QuoteBlock} onChange={(b) => handleUpdateBlock(index, b)} />
                    )}
                  </BlockWrapper>
                ))}
              </div>
            )}

            {/* 底部添加栏 */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm mb-3">添加新模块</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="h-12 bg-[#1f1f1f] border-gray-700 text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-900/20"
                  icon={<FontSizeOutlined />}
                  onClick={() => handleAddBlock('text')}
                >
                  文本
                </Button>
                <Button 
                  className="h-12 bg-[#1f1f1f] border-gray-700 text-gray-300 hover:text-white hover:border-green-500 hover:bg-green-900/20"
                  icon={<PictureOutlined />}
                  onClick={() => handleAddBlock('image')}
                >
                  图片
                </Button>
                <Button 
                  className="h-12 bg-[#1f1f1f] border-gray-700 text-gray-300 hover:text-white hover:border-purple-500 hover:bg-purple-900/20"
                  icon={<AppstoreOutlined />}
                  onClick={() => handleAddBlock('gallery')}
                >
                  图集
                </Button>
                <Button 
                  className="h-12 bg-[#1f1f1f] border-gray-700 text-gray-300 hover:text-white hover:border-amber-500 hover:bg-amber-900/20"
                  icon={<BuildOutlined />}
                  onClick={() => handleAddBlock('quote')}
                >
                  引用
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippet;
