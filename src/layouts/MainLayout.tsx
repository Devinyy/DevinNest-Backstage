import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  CoffeeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined style={{ fontSize: '18px' }} />,
      label: '首页',
    },
    {
      key: '/blogs',
      icon: <BookOutlined style={{ fontSize: '18px' }} />,
      label: '博客管理',
    },
    {
      key: '/snippets',
      icon: <CoffeeOutlined style={{ fontSize: '18px' }} />,
      label: '日常碎片',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const userMenu: MenuProps = {
    items: [
      { key: 'profile', label: '个人中心' },
      { key: 'settings', label: '设置' },
      { type: 'divider' },
      { key: 'logout', label: '退出登录', danger: true },
    ],
    onClick: handleMenuClick,
  };

  return (
    <Layout className="h-screen overflow-hidden bg-[#000000]">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        className="border-r border-white/5 bg-[#000000]"
        width={240}
      >
        <div className="h-20 flex items-center justify-center">
            {collapsed ? (
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white font-bold text-xl">D</div>
            ) : (
               <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">DevinNest</span>
            )}
        </div>
        <div className="px-2">
            <Menu
              // theme="dark"  // 移除 dark 主题，避免 ant-menu-dark 带来的默认深蓝背景
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              className="bg-transparent border-none text-base"
              style={{ background: 'transparent' }} // 强制透明背景
            />
        </div>
      </Sider>
      <Layout className="bg-[#000000]">
        <Header className="flex items-center justify-between px-6 bg-[#000000] h-20">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl"
          />
          
          <Space size="large">
            <Badge dot color="red" offset={[-2, 2]}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="text-gray-400 hover:text-white hover:bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl"
              />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <div className="flex items-center cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-colors">
                <Avatar size="default" icon={<UserOutlined />} className="bg-white/10 text-white" />
                <span className="ml-3 text-sm font-medium text-gray-200">{user?.username || 'Devin'}</span>
              </div>
            </Dropdown>
          </Space>
        </Header>
        <Content
          className="m-6 mt-0 p-6 overflow-y-auto bg-transparent"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
