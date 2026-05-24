import { useEffect, useState } from 'react';
import { Table, DatePicker, Tag, Space, Button, message } from 'antd';
import dayjs from 'dayjs';
import client from '../../api/client';
import { Appointment } from '../../types';
import { formatHour } from '../../utils/format';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../utils/constants';

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const fetchByDate = async (d: string) => {
    try {
      const res = await client.get('/doctor/appointments', { params: { date: d } });
      setAppointments(res.data.data);
    } catch {
      message.error('获取预约列表失败');
    }
  };

  useEffect(() => {
    fetchByDate(date);
  }, [date]);

  const handleStatus = async (id: number, status: string) => {
    try {
      await client.patch(`/doctor/appointments/${id}/status`, { status });
      message.success('已更新');
      fetchByDate(date);
    } catch {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '患者姓名', dataIndex: 'patientName', key: 'patientName' },
    { title: '时段', key: 'time', render: (_: any, r: Appointment) => formatHour(r.hour) },
    {
      title: '状态',
      key: 'status',
      render: (_: any, r: Appointment) => (
        <Tag color={APPOINTMENT_STATUS_COLORS[r.status]}>{APPOINTMENT_STATUS_LABELS[r.status]}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, r: Appointment) =>
        r.status === 'PENDING' ? (
          <Space>
            <Button size="small" type="primary" onClick={() => handleStatus(r.id, 'VISITED')}>已就诊</Button>
            <Button size="small" danger onClick={() => handleStatus(r.id, 'NO_SHOW')}>未到</Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <div>
      <h2>按日期查看</h2>
      <DatePicker
        value={dayjs(date)}
        onChange={(d) => d && setDate(d.format('YYYY-MM-DD'))}
        style={{ marginBottom: 16 }}
      />
      <Table dataSource={appointments} columns={columns} rowKey="id" pagination={false} />
    </div>
  );
}
