import { useEffect, useRef, useState } from 'react';
import { Table, Tag, Button, message, Space, Modal, Input, List, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import client from '../../api/client';
import { Appointment, Prescription, MedicineCategory, Medicine } from '../../types';
import { formatHour } from '../../utils/format';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../utils/constants';
import { updateDiagnosis, getPrescriptions, addPrescription, deletePrescription } from '../../api/doctor';
import { getMedicineCategories, getMedicines } from '../../api/medicines';

const { TextArea } = Input;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newMedicine, setNewMedicine] = useState({ medicineName: '', dosage: '', method: '', days: 1 });
  const [medicineCategories, setMedicineCategories] = useState<MedicineCategory[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const today = dayjs().format('YYYY-MM-DD');
  const printRef = useRef<HTMLDivElement>(null);

  const fetchToday = async () => {
    try {
      const res = await client.get('/doctor/appointments', { params: { date: today } });
      setAppointments(res.data.data);
    } catch {
      message.error('获取今日预约列表失败');
    }
  };

  useEffect(() => {
    fetchToday();
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const [catRes, medRes] = await Promise.all([getMedicineCategories(), getMedicines()]);
      setMedicineCategories(catRes.data);
      setMedicines(medRes.data);
    } catch {
      // ignore
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await client.patch(`/doctor/appointments/${id}/status`, { status });
      message.success('状态已更新');
      fetchToday();
    } catch {
      message.error('操作失败');
    }
  };

  const openDiagnosisModal = async (appt: Appointment) => {
    setSelectedAppointment(appt);
    setDiagnosisText(appt.diagnosis || '');
    setDiagnosisModalOpen(true);
  };

  const handleSaveDiagnosis = async () => {
    if (!selectedAppointment) return;
    try {
      await updateDiagnosis(selectedAppointment.id, diagnosisText);
      message.success('诊断已保存');
      setDiagnosisModalOpen(false);
      fetchToday();
    } catch {
      message.error('保存诊断失败');
    }
  };

  const openPrescriptionModal = async (appt: Appointment) => {
    setSelectedAppointment(appt);
    setPrescriptions([]);
    setNewMedicine({ medicineName: '', dosage: '', method: '', days: 1 });
    setPrescriptionModalOpen(true);
    try {
      const res = await getPrescriptions(appt.id);
      setPrescriptions(res.data);
    } catch {
      // ignore
    }
  };

  const handleAddPrescription = async () => {
    if (!selectedAppointment) return;
    if (!newMedicine.medicineName || !newMedicine.dosage || !newMedicine.method) {
      message.warning('请填写完整的药品信息');
      return;
    }
    try {
      await addPrescription(selectedAppointment.id, newMedicine);
      message.success('药品已添加');
      setNewMedicine({ medicineName: '', dosage: '', method: '', days: 1 });
      const res = await getPrescriptions(selectedAppointment.id);
      setPrescriptions(res.data);
    } catch {
      message.error('添加药品失败');
    }
  };

  const handleDeletePrescription = async (prescriptionId: number) => {
    if (!selectedAppointment) return;
    try {
      await deletePrescription(selectedAppointment.id, prescriptionId);
      message.success('药品已删除');
      const res = await getPrescriptions(selectedAppointment.id);
      setPrescriptions(res.data);
    } catch {
      message.error('删除失败');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: '患者姓名',
      key: 'patientName',
      render: (_: any, r: Appointment) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => navigate(`/doctor/patients/${r.patientId}/history`)}>
          {r.patientName}
        </Button>
      ),
    },
    { title: '预约时段', key: 'time', render: (_: any, r: Appointment) => formatHour(r.hour) },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '病情描述',
      key: 'symptom',
      render: (_: any, r: Appointment) => r.symptom || '-',
    },
    {
      title: '诊断',
      key: 'diagnosis',
      render: (_: any, r: Appointment) => (
        r.status === 'VISITED' ? (
          <span>{r.diagnosis || '-'}</span>
        ) : '-'
      ),
    },
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
      render: (_: any, r: Appointment) => (
        r.status === 'PENDING' ? (
          <Space>
            <Button size="small" type="primary" onClick={() => handleStatus(r.id, 'VISITED')}>已就诊</Button>
            <Button size="small" danger onClick={() => handleStatus(r.id, 'NO_SHOW')}>未到</Button>
          </Space>
        ) : r.status === 'VISITED' ? (
          <Space>
            <Button size="small" onClick={() => openDiagnosisModal(r)}>诊断</Button>
            <Button size="small" onClick={() => openPrescriptionModal(r)}>开药</Button>
            <Button size="small" onClick={() => openPrescriptionModal(r)}>打印处方</Button>
          </Space>
        ) : null
      ),
    },
  ];

  return (
    <div>
      <h2>今日待就诊 ({today})</h2>
      <Table dataSource={appointments} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title="填写诊断"
        open={diagnosisModalOpen}
        onOk={handleSaveDiagnosis}
        onCancel={() => setDiagnosisModalOpen(false)}
      >
        <TextArea
          rows={4}
          placeholder="请输入诊断结果..."
          value={diagnosisText}
          onChange={(e) => setDiagnosisText(e.target.value)}
        />
      </Modal>

      <Modal
        title="处方管理"
        open={prescriptionModalOpen}
        footer={null}
        onCancel={() => setPrescriptionModalOpen(false)}
        width={500}
      >
        <div ref={printRef} id="prescription-print-area" style={{ padding: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 16, display: 'none' }} className="print-header">
            <h2>医院门诊处方笺</h2>
          </div>
          {selectedAppointment && (
            <div style={{ marginBottom: 12 }}>
              <p><strong>患者：</strong>{selectedAppointment.patientName}</p>
              <p><strong>诊断：</strong>{selectedAppointment.diagnosis || '（未填写）'}</p>
            </div>
          )}
          <List
            dataSource={prescriptions}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button size="small" danger onClick={() => handleDeletePrescription(item.id)}>删除</Button>,
                ]}
              >
                <strong>{item.medicineName}</strong> — {item.dosage}，{item.method}，共{item.days}天
              </List.Item>
            )}
            locale={{ emptyText: '暂无处方' }}
          />
          <div style={{ textAlign: 'right', marginTop: 24, display: 'none' }} className="print-footer">
            <p>医生签名：______________</p>
            <p>日期：{dayjs().format('YYYY年MM月DD日')}</p>
          </div>
        </div>
        <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              showSearch
              placeholder="选择药品（按分类）"
              value={newMedicine.medicineName || undefined}
              onChange={(val) => {
                const med = medicines.find((m) => m.name === val);
                setNewMedicine({
                  medicineName: val,
                  dosage: med?.commonDosage || '',
                  method: med?.commonMethod || '',
                  days: 1,
                });
              }}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={medicineCategories.map((cat) => ({
                label: cat.name,
                options: medicines
                  .filter((m) => m.categoryId === cat.id)
                  .map((m) => ({ label: m.name, value: m.name })),
              }))}
            />
            <Space>
              <Input
                placeholder="用量（如每次1片）"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                style={{ width: 180 }}
              />
              <Input
                placeholder="用法（如每日3次）"
                value={newMedicine.method}
                onChange={(e) => setNewMedicine({ ...newMedicine, method: e.target.value })}
                style={{ width: 180 }}
              />
              <Input
                type="number"
                placeholder="天数"
                value={newMedicine.days}
                onChange={(e) => setNewMedicine({ ...newMedicine, days: parseInt(e.target.value) || 1 })}
                style={{ width: 80 }}
                min={1}
              />
            </Space>
            <Space>
              <Button type="primary" onClick={handleAddPrescription}>添加药品</Button>
              <Button onClick={handlePrint}>打印处方</Button>
            </Space>
          </Space>
        </div>
      </Modal>
    </div>
  );
}
