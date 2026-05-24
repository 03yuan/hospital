import { useEffect, useState } from 'react';
import { Tabs, Modal, message, List } from 'antd';
import { getAppointments, cancelAppointment } from '../../api/appointments';
import client from '../../api/client';
import { Appointment, Prescription } from '../../types';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';

export default function MyAppointmentsPage() {
  const [pending, setPending] = useState<Appointment[]>([]);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<Prescription[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchData = async () => {
    try {
      const [pendingRes, historyRes] = await Promise.all([
        getAppointments('PENDING'),
        getAppointments(),
      ]);
      setPending(pendingRes.data);
      setHistory(historyRes.data.filter((a: Appointment) => a.status !== 'PENDING'));
    } catch {
      message.error('获取预约列表失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      await cancelAppointment(id);
      message.success('已取消');
      fetchData();
    } catch {
      message.error('取消失败');
    }
  };

  const handleViewDetail = async (id: number) => {
    const appt = [...pending, ...history].find((a) => a.id === id);
    if (!appt) return;
    setSelectedAppointment(appt);
    try {
      const res = await client.get(`/doctor/appointments/${id}/prescriptions`);
      setSelectedPrescriptions(res.data.data || []);
    } catch {
      setSelectedPrescriptions([]);
    }
    setDetailModalOpen(true);
  };

  const items = [
    {
      key: 'pending',
      label: `待就诊 (${pending.length})`,
      children: pending.length === 0 ? <div>暂无待就诊预约</div> : (
        pending.map((apt) => (
          <AppointmentCard key={apt.id} {...apt} onCancel={handleCancel} />
        ))
      ),
    },
    {
      key: 'history',
      label: '历史记录',
      children: history.length === 0 ? <div>暂无历史记录</div> : (
        history.map((apt) => (
          <AppointmentCard key={apt.id} {...apt} onViewDetail={apt.status === 'VISITED' ? handleViewDetail : undefined} />
        ))
      ),
    },
  ];

  return (
    <>
      <Tabs items={items} />
      <Modal
        title="就诊详情"
        open={detailModalOpen}
        footer={null}
        onCancel={() => setDetailModalOpen(false)}
      >
        {selectedAppointment && (
          <div>
            <p><strong>科室：</strong>{selectedAppointment.departmentName}</p>
            <p><strong>医生：</strong>{selectedAppointment.doctorName}</p>
            <p><strong>日期：</strong>{selectedAppointment.date}</p>
            {selectedAppointment.symptom && <p><strong>病情描述：</strong>{selectedAppointment.symptom}</p>}
            {selectedAppointment.diagnosis && <p><strong>诊断结果：</strong>{selectedAppointment.diagnosis}</p>}
            <h4 style={{ marginTop: 16 }}>处方</h4>
            {selectedPrescriptions.length === 0 ? (
              <p>暂无处方</p>
            ) : (
              <List
                dataSource={selectedPrescriptions}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.medicineName}</strong> — {item.dosage}，{item.method}，共{item.days}天
                  </List.Item>
                )}
              />
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
