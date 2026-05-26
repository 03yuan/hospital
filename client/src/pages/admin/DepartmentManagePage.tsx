import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, message, Popconfirm } from 'antd';
import { getAdminDepartments, createAdminDepartment, updateAdminDepartment, deleteAdminDepartment, toggleAdminDepartmentStatus } from '../../api/admin';

export default function DepartmentManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getAdminDepartments();
    setData(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateAdminDepartment(editing.id, values);
    } else {
      await createAdminDepartment(values);
    }
    message.success('操作成功');
    setOpen(false);
    setEditing(null);
    form.resetFields();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteAdminDepartment(id);
    message.success('已删除');
    fetchData();
  };

  const handleToggleStatus = async (id: number, status: string) => {
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await toggleAdminDepartmentStatus(id, newStatus);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag>{s === 'ACTIVE' ? '启用' : '停用'}</Tag>,
    },
    {
      title: '操作', key: 'action',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</Button>
          <Button size="small" onClick={() => handleToggleStatus(r.id, r.status)}>
            {r.status === 'ACTIVE' ? '停用' : '启用'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>科室管理</h2>
        <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增科室</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={false} locale={{ emptyText: '暂无科室，请点击右上角"新增科室"添加' }} />
      <Modal
        title={editing ? '编辑科室' : '新增科室'}
        open={open}
        onOk={handleSave}
        onCancel={() => { setOpen(false); setEditing(null); }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入科室名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
