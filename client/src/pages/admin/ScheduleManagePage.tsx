import { useEffect, useState } from 'react';
import { Card, Form, Select, DatePicker, InputNumber, Button, Table, message, Space, Popconfirm, Tabs } from 'antd';
import dayjs from 'dayjs';
import { getAdminDoctors, getAdminSchedules, createAdminSchedule, deleteAdminSchedule, batchCreateSchedules } from '../../api/admin';
import { formatHour } from '../../utils/format';

const { RangePicker } = DatePicker;

export default function ScheduleManagePage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getAdminDoctors().then((res) => setDoctors(res.data));
  }, []);

  const fetchSchedules = async (doctorId: number) => {
    const res = await getAdminSchedules(doctorId);
    setAllSchedules(res.data || []);
  };

  const handleDoctorChange = (value: number) => {
    setSelectedDoctor(value);
    fetchSchedules(value);
  };

  const handleAdd = async (values: any) => {
    if (!selectedDoctor) return;
    await createAdminSchedule({ doctorId: selectedDoctor, date: values.date.format('YYYY-MM-DD'), hour: values.hour });
    message.success('已添加');
    fetchSchedules(selectedDoctor);
  };

  const handleDelete = async (id: number) => {
    await deleteAdminSchedule(id);
    message.success('已删除');
    if (selectedDoctor) fetchSchedules(selectedDoctor);
  };

  const handleBatch = async (values: any) => {
    if (!selectedDoctor) return;
    const [start, end] = values.dateRange;
    await batchCreateSchedules({
      doctorId: selectedDoctor,
      dateRange: { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') },
      hourRanges: values.hourRanges || [{ start: 8, end: 12 }],
    });
    message.success('批量创建成功');
    fetchSchedules(selectedDoctor);
  };

  const today = dayjs().startOf('day');
  const upcoming = allSchedules.filter((s) => dayjs(s.date).isAfter(today) || dayjs(s.date).isSame(today, 'day'));
  const history = allSchedules.filter((s) => dayjs(s.date).isBefore(today));

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '时段', key: 'hour', render: (_: any, r: any) => formatHour(r.hour) },
    {
      title: '操作', key: 'action',
      render: (_: any, r: any) => (
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  const historyColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '时段', key: 'hour', render: (_: any, r: any) => formatHour(r.hour) },
  ];

  return (
    <div>
      <h2>排班管理</h2>
      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline">
          <Form.Item label="医生">
            <Select style={{ width: 200 }} placeholder="选择医生" onChange={handleDoctorChange}>
              {doctors.map((d) => (
                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>

      {selectedDoctor && (
        <>
          <Card title="新增排班" style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleAdd}>
              <Form.Item name="date" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name="hour" rules={[{ required: true }]}>
                <InputNumber min={0} max={23} placeholder="小时" />
              </Form.Item>
              <Button type="primary" htmlType="submit">添加</Button>
            </Form>
          </Card>

          <Card title="批量创建排班" style={{ marginBottom: 16 }}>
            <Form layout="inline" onFinish={handleBatch}>
              <Form.Item name="dateRange" rules={[{ required: true }]}>
                <RangePicker />
              </Form.Item>
              <Button type="primary" htmlType="submit">批量生成</Button>
            </Form>
          </Card>

          <Tabs
            items={[
              {
                key: 'upcoming',
                label: `近期排班 (${upcoming.length})`,
                children: (
                  <Table dataSource={upcoming} columns={columns} rowKey="id" pagination={false} />
                ),
              },
              {
                key: 'history',
                label: `历史排班 (${history.length})`,
                children: (
                  <Table dataSource={history} columns={historyColumns} rowKey="id" pagination={false} />
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
