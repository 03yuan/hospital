import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      await login(values.phone, values.password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (user?.role === 'ADMIN') navigate('/admin/departments');
      else navigate('/patient/departments');
    } catch {
      message.error('登录失败，请检查手机号和密码');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ fontSize: 56, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 }}>南工职大附属医院</div>
      <Card title="医院门诊挂号诊断系统 - 登录" style={{ width: 400, marginTop: 80 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            还没有账号？<Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
