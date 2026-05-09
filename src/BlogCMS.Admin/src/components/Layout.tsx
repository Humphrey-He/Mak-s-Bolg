import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Dropdown, Space, Avatar, Typography, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, TagOutlined, FileImageOutlined, ReadOutlined } from '@ant-design/icons';
import { authApi, getStoredUser, clearAuthData } from '../services/api';

const { Header, Content, Sider } = AntLayout;
const { Text } = Typography;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors
    }
    clearAuthData();
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'username',
      label: <Text strong>{user?.username}</Text>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const navItems: MenuProps['items'] = [
    {
      key: '/articles',
      icon: <ReadOutlined />,
      label: 'Articles',
    },
    {
      key: '/tags',
      icon: <TagOutlined />,
      label: 'Tags',
    },
    {
      key: '/media',
      icon: <FileImageOutlined />,
      label: 'Media',
    },
  ];

  const handleNavClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Text strong style={{ fontSize: 18 }}>
          Blog CMS
        </Text>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Text>{user?.displayName || user?.username}</Text>
          </Space>
        </Dropdown>
      </Header>
      <AntLayout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navItems}
            onClick={handleNavClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
