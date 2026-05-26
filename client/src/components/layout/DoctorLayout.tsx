import { Layout, Menu, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { DashboardOutlined, CalendarOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { NotificationBell } from '../notification/NotificationBell';

const { Sider, Content } = Layout;

export function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { key: '/doctor/dashboard', icon: <DashboardOutlined />, label: '今日待就诊' },
    { key: '/doctor/appointments', icon: <CalendarOutlined />, label: '按日期查看' },
    { key: '/doctor/profile', icon: <SettingOutlined />, label: '个人资料' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: '#fff', padding: 16, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>南工职大附属医院</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: 16, alignItems: 'center' }}>
            <NotificationBell />
            <UserOutlined /> {user?.name}
            <Button type="link" onClick={() => { logout(); navigate('/login'); }}>
              退出
            </Button>
          </div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
