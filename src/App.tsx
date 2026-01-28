import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import Snippets from './pages/Snippets';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RequireAuth from './components/RequireAuth';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ffffff', // 全局主色改为白色，极致简约
          colorInfo: '#ffffff', // Info 色也改为白色
          colorBgBase: '#000000', // Pure Black
          colorBgContainer: '#121212', // Neutral Dark Gray
          borderRadius: 12, // 更大的圆角
          borderRadiusLG: 16,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          colorTextBase: '#e5e5e5', // Neutral 200
          colorBorder: '#262626', // Neutral 800
        },
        components: {
          Layout: {
            bodyBg: '#000000',
            headerBg: '#000000',
            siderBg: '#000000',
          },
          Card: {
            colorBgContainer: '#121212',
            colorBorderSecondary: '#262626',
          },
          Table: {
            colorBgContainer: '#121212',
            headerBg: '#121212', // 表头背景与内容一致
            rowHoverBg: '#1e1e1e',
          },
          Menu: {
            itemBg: 'transparent',
            itemColor: '#a1a1aa', // 未选中文字颜色 (Zinc 400)
            itemHoverBg: 'transparent', // 悬停背景透明，交给 CSS 处理动效
            itemHoverColor: '#ffffff', // 悬停文字颜色
            
            itemSelectedBg: 'transparent', // 选中背景透明，交给 CSS 处理样式
            itemSelectedColor: '#ffffff', // 选中文字纯白
            
            subMenuItemBg: 'transparent',
            activeBarBorderWidth: 0, // 去掉默认的选中条
            itemBorderRadius: 0, // 去掉圆角，配合左侧线条风格
            itemMarginInline: 0, // 去掉左右间距，让菜单占满宽度
            itemHeight: 50, // 增加高度
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="snippets" element={<Snippets />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
