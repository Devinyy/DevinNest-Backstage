import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Card, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import markdownItSub from 'markdown-it-sub';
// @ts-ignore
import markdownItSup from 'markdown-it-sup';
// @ts-ignore
import markdownItKbd from 'markdown-it-kbd';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { createBlog, updateBlog, getBlogDetail, uploadFile } from '../../api/blogs';
import { getCategories, getTags } from '../../api/taxonomy';
import type { Category, Tag } from '../../api/taxonomy';
import type { UploadFile } from 'antd/es/upload/interface';

// 自定义插件：解析图片 URL 后面的尺寸参数
const imageResizePlugin = (md: MarkdownIt) => {
  const defaultRender = md.renderer.rules.image || function(tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    
    if (srcIndex >= 0) {
      const src = token.attrs![srcIndex][1];
      const match = src.match(/[=#](\d+)x(\d+)$/);
      
      if (match) {
        const [_, w, h] = match;
         if (w || h) {
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
  .use(imageResizePlugin)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItKbd);

const { Option } = Select;

// Markdown 编辑器组件
const MarkdownEditor = ({ value, onChange }: any) => {
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const res = await uploadFile(file);
      return res.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      message.error('图片上传失败');
      throw error;
    }
  };

  return (
    <div className="markdown-editor-wrapper">
      <MdEditor
        value={value || ''}
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
        /* 标题样式 */
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
        /* 表格样式 */
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
        /* 列表样式 */
        .markdown-editor-wrapper .custom-html-style ul,
        .markdown-editor-wrapper .custom-html-style ol {
          padding-left: 24px !important;
          margin: 16px 0 !important;
          list-style-position: outside !important;
        }
        .markdown-editor-wrapper .custom-html-style ul {
          list-style-type: disc !important;
        }
        .markdown-editor-wrapper .custom-html-style ol {
          list-style-type: decimal !important;
        }
        .markdown-editor-wrapper .custom-html-style li {
          margin-bottom: 8px !important;
          line-height: 1.6 !important;
          display: list-item !important; /* 强制显示为列表项 */
        }

        /* 上标下标样式 */
        .markdown-editor-wrapper .custom-html-style sub {
          vertical-align: sub;
          font-size: smaller;
        }
        .markdown-editor-wrapper .custom-html-style sup {
          vertical-align: super;
          font-size: smaller;
        }

        /* 键盘样式 */
        .markdown-editor-wrapper .custom-html-style kbd {
          background-color: #2a2a2a;
          border-radius: 3px;
          border: 1px solid #444;
          box-shadow: 0 1px 0 rgba(0,0,0,0.2), 0 0 0 2px #333 inset;
          color: #eee;
          display: inline-block;
          font-size: 0.85em;
          font-weight: 700;
          line-height: 1;
          padding: 2px 4px;
          white-space: nowrap;
          margin: 0 2px;
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        }

        /* 代码块样式 */
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
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // 获取分类和标签数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to fetch taxonomy data:', error);
        message.error('获取分类和标签数据失败');
      }
    };

    fetchData();
  }, []);

  // 初始化数据
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getBlogDetail(id)
        .then(async (data) => {
          form.setFieldsValue({
            ...data,
            content: data.content || '',
            tags: data.tagIds || data.tags?.map((t: any) => typeof t === 'object' ? t.id : t) || [],
            category: data.categoryId || (typeof data.category === 'object' ? data.category?.id : data.category)
          });

          if (data.cover) {
            setCoverUrl(data.cover);
            setFileList([{
              uid: '-1',
              name: 'cover.png',
              status: 'done',
              url: data.cover,
            }]);
          }
          
          // 触发一下校验以更新按钮状态
          const values = form.getFieldsValue();
          checkPublishState(values);
        })
        .catch(err => {
          message.error('获取博客详情失败');
          navigate('/blogs');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEdit, form, navigate]);
  
  const checkPublishState = (values: any) => {
    const hasTitle = !!values.title?.trim();
    const hasSubtitle = !!values.subtitle?.trim();
    const hasContent = !!values.content?.trim();
    const hasCategory = !!values.category;
    const hasTags = Array.isArray(values.tags) && values.tags.length > 0;
    
    // 检查必填项 (封面图已改为选填)
    setCanPublish(!!(hasTitle && hasSubtitle && hasContent && hasCategory && hasTags));
  };

  const handleValuesChange = (_: any, allValues: any) => {
    checkPublishState(allValues);
  };

  const handleCoverUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file);
      setCoverUrl(res.url);
      setFileList([{
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: res.url,
        
      }]);
      onSuccess(res.url);
      
      // 手动触发校验
      const values = form.getFieldsValue();
      checkPublishState(values);
    } catch (err) {
      console.error(err);
      onError(err);
      message.error('封面上传失败');
    }
  };

  const onRemoveCover = () => {
    setCoverUrl('');
    setFileList([]);
    const values = form.getFieldsValue();
    checkPublishState(values);
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        categoryId: values.category,
        tagIds: values.tags || [],
        cover: coverUrl,
        status: 'published',
        content: values.content,
      };

      if (isEdit && id) {
        await updateBlog({ ...payload, id });
        message.success('更新成功');
      } else {
        await createBlog(payload as any);
        message.success('发布成功');
      }
      navigate('/blogs');
    } catch (error) {
      console.error(error);
      // 错误信息已在 request 拦截器处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center cursor-pointer group" onClick={() => navigate(-1)}>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
            <ArrowLeftOutlined className="text-gray-400 group-hover:text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white m-0">{isEdit ? '编辑博客' : '写文章'}</h1>
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
            {isEdit ? '更新' : '发布'}
          </Button>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        className="w-full h-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
          {/* 左侧主要编辑区 */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="neo-card border-none bg-[#121212] h-full" bordered={false} bodyStyle={{ height: '100%' }}>
              <div className="h-full flex flex-col">
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
                  rules={[{ required: true, message: '请输入副标题' }]}
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
              </div>
            </Card>
          </div>

          {/* 右侧设置区 */}
          <div className="space-y-6">
            <Card title={<span className="text-white">发布设置</span>} className="neo-card border-none bg-[#121212]" bordered={false}>
              <Form.Item 
                label={<span className="text-gray-400">分类</span>} 
                name="category" 
                className="mb-4"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select 
                  placeholder="选择分类" 
                  className="custom-select"
                  popupClassName="bg-[#1f1f1f] border border-gray-800"
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label={<span className="text-gray-400">标签</span>} 
                name="tags" 
                className="mb-4"
                rules={[{ required: true, message: '请选择标签' }]}
              >
                <Select
                  mode="tags"
                  placeholder="输入标签"
                  className="custom-select"
                  popupClassName="bg-[#1f1f1f] border border-gray-800"
                  optionFilterProp="children"
                >
                  {tags.map(tag => (
                    <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label={<span className="text-gray-400">封面图</span>} 
                className="mb-4"
              >
                <Upload.Dragger 
                  name="file"
                  maxCount={1}
                  fileList={fileList}
                  customRequest={handleCoverUpload}
                  onRemove={onRemoveCover}
                  className="bg-white/5 border-dashed border-gray-700 hover:border-blue-500 transition-colors"
                  showUploadList={{
                    showRemoveIcon: true,
                    showPreviewIcon: false
                  }}
                >
                  {fileList.length >= 1 && fileList[0].url ? (
                    <img 
                      src={fileList[0].url} 
                      alt="cover" 
                      className="max-h-[200px] w-full object-contain"
                    />
                  ) : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined className="text-gray-500" />
                      </p>
                      <p className="text-gray-400 text-sm">点击或拖拽上传封面</p>
                    </>
                  )}
                </Upload.Dragger>
              </Form.Item>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateBlog;
