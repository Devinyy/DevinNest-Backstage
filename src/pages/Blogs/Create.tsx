import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, Card, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

// 自定义插件：解析图片 URL 后面的尺寸参数
// 支持语法：![alt](url =100x100) 或 ![alt](url#100x100)
// 注意：标准 Markdown 解析可能会因为空格截断 URL，推荐使用无空格的 # 语法
const imageResizePlugin = (md: MarkdownIt) => {
  // 自定义图片渲染
  const defaultRender = md.renderer.rules.image || function(tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    
    if (srcIndex >= 0) {
      const src = token.attrs![srcIndex][1];
      // 匹配 =WxH 或 #WxH 格式
      const match = src.match(/[=#](\d+)x(\d+)$/);
      
      if (match) {
        const [_, w, h] = match;
         // 只有当至少有一个数字时才处理
         if (w || h) {
           // 移除 URL 末尾的尺寸参数，保留原始 URL 路径
           token.attrs![srcIndex][1] = src.substring(0, match.index);
           
           if (w) token.attrSet('width', w);
           if (h) token.attrSet('height', h);
         }
      }
    }
    
    return defaultRender(tokens, idx, options, env, self);
  };
};

const mdParser = new MarkdownIt({ html: true, typographer: true })
  .use(imageResizePlugin);

const { Option } = Select;

// 自定义 Markdown 编辑器组件以适配 Ant Design Form
const MarkdownEditor = ({ value, onChange }: any) => {
  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // 模拟图片上传，使用 ObjectURL 本地预览
      // 在实际项目中，这里应该调用上传接口，返回图片的远程 URL
      const url = URL.createObjectURL(file);
      resolve(url);
    });
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    // 查找剪贴板中的图片项
    const items = e.clipboardData.items;
    const item = Array.from(items).find(item => item.type.indexOf('image') !== -1);

    if (item) {
      // 阻止默认粘贴行为（防止出现默认的 Uploading... 占位符）
      e.preventDefault();
      
      const file = item.getAsFile();
      if (!file) return;

      const loadingHide = message.loading('正在上传图片...', 0);
      
      try {
        const url = await handleImageUpload(file);
        const imageMd = `![${file.name}](${url})`;
        
        // 尝试获取当前聚焦的 textarea 以在光标位置插入
        const activeElement = document.activeElement as HTMLTextAreaElement;
        
        if (activeElement && activeElement.tagName === 'TEXTAREA') {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const text = activeElement.value;
            // 插入图片 Markdown
            const newValue = text.substring(0, start) + imageMd + text.substring(end);
            onChange(newValue);
            
            // 注意：光标位置会在 React 重渲染后重置到末尾，这是一个已知限制
            // 但内容会插入到正确位置
        } else {
            // 如果无法获取光标位置，则追加到末尾
            const newValue = value ? `${value}\n${imageMd}` : imageMd;
            onChange(newValue);
        }
        
        message.success('图片粘贴成功');
      } catch (error) {
        console.error(error);
        message.error('图片上传失败');
      } finally {
        loadingHide();
      }
    }
  };

  return (
    <div className="markdown-editor-wrapper" onPaste={handlePaste}>
      <MdEditor
        value={value}
        style={{ height: 'calc(100vh - 200px)', backgroundColor: 'transparent' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={({ text }) => onChange(text)}
        onImageUpload={handleImageUpload}
        view={{ menu: true, md: true, html: true }}
        placeholder="开始你的创作..."
      />
      <style>{`
        .markdown-editor-wrapper .rc-md-editor {
          background-color: transparent !important;
          border: 1px solid #333 !important;
          border-radius: 8px;
        }
        .markdown-editor-wrapper .rc-md-navigation {
          background-color: #1f1f1f !important;
          border-bottom: 1px solid #333 !important;
        }
        .markdown-editor-wrapper .rc-md-editor .editor-container .section {
          background-color: #121212 !important;
        }
        .markdown-editor-wrapper .rc-md-editor .editor-container .input {
          background-color: #121212 !important;
          color: #e5e5e5 !important;
        }
        .markdown-editor-wrapper .rc-md-editor .editor-container .custom-html-style {
          color: #e5e5e5 !important;
        }
        /* 标题样式：文字白色，无背景 */
        .markdown-editor-wrapper .custom-html-style h1,
        .markdown-editor-wrapper .custom-html-style h2,
        .markdown-editor-wrapper .custom-html-style h3,
        .markdown-editor-wrapper .custom-html-style h4,
        .markdown-editor-wrapper .custom-html-style h5,
        .markdown-editor-wrapper .custom-html-style h6 {
          color: #fff !important;
          margin-top: 24px;
          margin-bottom: 16px;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
        }
        
        /* 表格样式优化 */
        .markdown-editor-wrapper .custom-html-style table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          border: 1px solid #333;
        }
        .markdown-editor-wrapper .custom-html-style th {
          background-color: #333 !important;
          color: #fff !important;
          font-weight: 600;
          padding: 12px;
          border: 1px solid #444;
          text-align: left;
        }
        .markdown-editor-wrapper .custom-html-style td {
          padding: 12px;
          border: 1px solid #333;
          color: #e5e5e5;
        }
        .markdown-editor-wrapper .custom-html-style tr:nth-child(even) {
          background-color: #1a1a1a;
        }
        
        /* 代码块样式：背景纯黑，文字白色 */
        .markdown-editor-wrapper .custom-html-style pre {
          background-color: #000 !important;
          color: #fff !important;
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }
        .markdown-editor-wrapper .custom-html-style code {
          background-color: #000 !important;
          color: #fff !important;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .markdown-editor-wrapper .button-wrap:hover {
          background-color: #333 !important;
        }
        .markdown-editor-wrapper .rc-md-navigation .button-wrap .button-type-menu {
          color: #aaa !important;
        }
        .markdown-editor-wrapper .rc-md-navigation .button-wrap .button-type-menu:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  
  // 监听表单值变化
  const handleValuesChange = (_: any, allValues: any) => {
    const hasTitle = !!allValues.title?.trim();
    const hasContent = !!allValues.content?.trim();
    const hasCategory = !!allValues.category;
    // 标签虽然可能不是必填，但如果有规则也可以加在这里
    setCanPublish(hasTitle && hasContent && hasCategory);
  };

  const onFinish = (values: any) => {
    setLoading(true);

    // 构造 Frontmatter 数据
    const frontmatter = [
      '---',
      `title: ${values.title || ''}`,
      `subtitle: ${values.subtitle || ''}`,
      `date: ${new Date().toISOString()}`,
      `tags: [${(values.tags || []).join(', ')}]`,
      `categories: ${values.category || ''}`,
      `cover: ${values.cover?.file?.name || ''}`, // 假设上传组件返回 file 对象
      '---',
      '',
      values.content || ''
    ].join('\n');

    console.log('Generated Markdown:', frontmatter);

    // 模拟提交
    setTimeout(() => {
      message.success('博客发布成功！');
      console.log('Final Data:', frontmatter);
      setLoading(false);
      navigate('/blogs');
    }, 1000);
  };

  return (
    <div className="w-full px-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        {/* 左侧主要编辑区 */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="neo-card border-none bg-[#121212] h-full" bordered={false} bodyStyle={{ height: '100%' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={handleValuesChange}
              initialValues={{ visibility: 'public' }}
              className="h-full flex flex-col"
            >
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
                className="mb-0"
              >
                <Input 
                  placeholder="请输入文章标题..." 
                  className="text-2xl font-bold bg-transparent border-none placeholder-gray-600 focus:shadow-none px-0 py-2 !text-white"
                  bordered={false} 
                />
              </Form.Item>

              <Form.Item
                name="subtitle"
                className="mb-6"
              >
                <Input 
                  placeholder="请输入副标题..." 
                  className="text-lg font-medium bg-transparent border-none placeholder-gray-600 focus:shadow-none px-0 py-1 !text-gray-300"
                  bordered={false} 
                />
              </Form.Item>

              <Form.Item
                name="content"
                rules={[{ required: true, message: '请输入文章内容' }]}
                className="flex-1"
              >
                <MarkdownEditor />
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
