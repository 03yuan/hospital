import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { getAdminDoctors, createAdminDoctor, updateAdminDoctor, toggleAdminDoctorStatus } from '../../api/admin';
import { getAdminDepartments } from '../../api/admin';

export default function DoctorManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const [docRes, deptRes] = await Promise.all([getAdminDoctors(), getAdminDepartments()]);
    setData(docRes.data);
    setDepartments(deptRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateAdminDoctor(editing.id, values);
    } else {
      await createAdminDoctor(values);
    }
    message.success('操作成功');
    setOpen(false);
    setEditing(null);
    form.resetFields();
    fetchData();
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await toggleAdminDoctorStatus(id, newStatus);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '所属科室', dataIndex: 'departmentName', key: 'departmentName' },
    { title: '职称', dataIndex: 'title', key: 'title' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => s === 'DISABLED' ? <Tag color="error">已停用</Tag> : <Tag color="success">正常</Tag>,
    },
    {
      title: '操作', key: 'action',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</Button>
          <Popconfirm title={r.status === 'ACTIVE' ? '确定停用该医生？' : '确定启用该医生？'} onConfirm={() => handleToggleStatus(r.id, r.status)}>
            <Button size="small" danger={r.status === 'ACTIVE'}>{r.status === 'ACTIVE' ? '停用' : '启用'}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>医生管理</h2>
        <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增医生</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={false} />
      <Modal title={editing ? '编辑医生' : '新增医生'} open={open} onOk={handleSave} onCancel={() => { setOpen(false); setEditing(null); }}>
        <Form form={form} layout="vertical">
          {!editing && (
            <>
              <Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/ }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="密码">
                <Input.Password placeholder="默认 123456" />
              </Form.Item>
            </>
          )}
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="departmentId" label="所属科室" rules={[{ required: true }]}>
            <Select>
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="title" label="职称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="简介">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
