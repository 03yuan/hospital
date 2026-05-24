import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { TeamOutlined, UserOutlined, ScheduleOutlined, BarChartOutlined } from '@ant-design/icons';
import { NotificationBell } from '../notification/NotificationBell';

const { Sider, Content } = Layout;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { key: '/admin/departments', icon: <TeamOutlined />, label: '科室管理' },
    { key: '/admin/doctors', icon: <UserOutlined />, label: '医生管理' },
    { key: '/admin/schedules', icon: <ScheduleOutlined />, label: '排班管理' },
    { key: '/admin/statistics', icon: <BarChartOutlined />, label: '数据统计' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: '#fff', padding: 16, textAlign: 'center', fontSize: 16 }}>管理后台</div>
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
