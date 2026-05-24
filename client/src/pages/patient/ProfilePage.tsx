import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { getProfile, updateProfile } from '../../api/profile';

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile().then((res) => {
      form.setFieldsValue({ name: res.data.name });
    });
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await updateProfile({
        name: values.name,
        oldPassword: values.oldPassword || undefined,
        newPassword: values.newPassword || undefined,
      });
      message.success('保存成功');
      form.resetFields(['oldPassword', 'newPassword']);
    } catch (err: any) {
      message.error(err?.response?.data?.message || '保存失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>个人中心</h2>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="手机号">
            <Input disabled value={form.getFieldValue('phone') || ''} />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="oldPassword" label="原密码">
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码">
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            保存
          </Button>
        </Form>
      </Card>
    </div>
  );
}
