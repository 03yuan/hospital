import { Layout, Menu, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserOutlined, CalendarOutlined, MedicineBoxOutlined, SettingOutlined } from '@ant-design/icons';
import { NotificationBell } from '../notification/NotificationBell';

const { Header, Content } = Layout;

export function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { key: '/patient/departments', icon: <MedicineBoxOutlined />, label: '科室列表' },
    { key: '/patient/appointments', icon: <CalendarOutlined />, label: '我的预约' },
    { key: '/patient/profile', icon: <SettingOutlined />, label: '个人中心' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>挂号系统</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        <Space size="middle" style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
          <NotificationBell />
          <UserOutlined /> {user?.name}
          <Button type="link" style={{ color: '#fff' }} onClick={() => { logout(); navigate('/login'); }}>
            退出
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
