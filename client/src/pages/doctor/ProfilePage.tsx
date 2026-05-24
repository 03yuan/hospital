import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getDoctorProfile, updateDoctorProfile } from '../../api/profile';
import client from '../../api/client';

export default function DoctorProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    getDoctorProfile().then((res) => {
      form.setFieldsValue({
        name: res.data.name,
        title: res.data.title,
        description: res.data.description,
      });
      if (res.data.photo) setPhotoUrl(res.data.photo);
    });
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data.url;
      setPhotoUrl(url);
      return url;
    } catch (err: any) {
      message.error(err?.response?.data?.message || '上传失败');
      return '';
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await updateDoctorProfile({
        name: values.name,
        title: values.title,
        description: values.description,
        photo: photoUrl || undefined,
      });
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>个人资料</h2>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="头像">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {photoUrl ? (
                <Image src={photoUrl} width={80} height={80} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>无头像</div>
              )}
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>上传头像</Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="职称" rules={[{ required: true, message: '请输入职称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="简介">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            保存
          </Button>
        </Form>
      </Card>
    </div>
  );
}
