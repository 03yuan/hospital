import { useEffect, useRef, useState } from 'react';
import { Table, Tag, Button, message, Space, Modal, Input, List, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import client from '../../api/client';
import { Appointment, Prescription, MedicineCategory, Medicine, ExaminationItem } from '../../types';
import { formatHour } from '../../utils/format';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../utils/constants';
import { updateDiagnosis, getPrescriptions, addPrescription, deletePrescription } from '../../api/doctor';
import { getMedicineCategories, getMedicines } from '../../api/medicines';
import { getExaminationItems, createExaminationOrder, getExaminationOrders } from '../../api/examinations';

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
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examItems, setExamItems] = useState<ExaminationItem[]>([]);
  const [selectedExamItems, setSelectedExamItems] = useState<number[]>([]);
  const [clinicalDiag, setClinicalDiag] = useState('');
  const [examOrders, setExamOrders] = useState<any[]>([]);
  const examPrintRef = useRef<HTMLDivElement>(null);
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

  const openExamModal = async (appt: Appointment) => {
    setSelectedAppointment(appt);
    setSelectedExamItems([]);
    setClinicalDiag('');
    setExamOrders([]);
    setExamModalOpen(true);
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        getExaminationItems(),
        getExaminationOrders(undefined, appt.id),
      ]);
      setExamItems(itemsRes.data);
      setExamOrders(ordersRes.data);
    } catch {
      message.error('获取数据失败');
    }
  };

  const handleCreateExamOrder = async () => {
    if (!selectedAppointment || selectedExamItems.length === 0) {
      message.warning('请选择检查项目');
      return;
    }
    try {
      await createExaminationOrder({
        patientId: selectedAppointment.patientId,
        appointmentId: selectedAppointment.id,
        clinicalDiag: clinicalDiag || undefined,
        itemIds: selectedExamItems,
      });
      message.success('检查单已开具');
      const ordersRes = await getExaminationOrders(undefined, selectedAppointment!.id);
      setExamOrders(ordersRes.data);
    } catch {
      message.error('开检查单失败');
    }
  };

  const handleExamPrint = () => {
    if (examOrders.length === 0) { message.warning('暂无检查单可打印'); return; }
    const printWindow = window.open('', '_blank');
    if (!printWindow) { message.error('浏览器阻止了打印窗口'); return; }
    printWindow.document.write(`
      <html><head><title>检查单</title>
      <style>
        body { font-family: SimSun, serif; padding: 40px; }
        h2 { text-align: center; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 14px; }
        th { background: #f0f0f0; }
        .info { margin-bottom: 8px; font-size: 14px; }
        .footer { margin-top: 48px; text-align: right; font-size: 14px; }
      </style></head><body>
      <h2>医院门诊检查申请单</h2>
      <div class="info"><strong>患者：</strong>${selectedAppointment?.patientName || ''}</div>
      <div class="info"><strong>诊断：</strong>${examOrders[0]?.clinicalDiag || '（未填写）'}</div>
      <table><tr><th>项目名称</th><th>类别</th><th>参考范围</th><th>单位</th></tr>
      ${examOrders.flatMap(o => o.items).map((i: any) =>
        `<tr><td>${i.itemName}</td><td>${i.category}</td><td>${i.refRange || '-'}</td><td>${i.unit || '-'}</td></tr>`
      ).join('')}
      </table>
      <div class="footer">医生签名：______________<br>日期：${dayjs().format('YYYY年MM月DD日')}</div>
      <script>window.onload=function(){window.print();window.close()}</script>
      </body></html>
    `);
    printWindow.document.close();
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
            <Button size="small" onClick={() => openExamModal(r)}>开检查</Button>
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
      <Table dataSource={appointments} columns={columns} rowKey="id" pagination={false} locale={{ emptyText: '今日暂无患者就诊' }} />

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
      <Modal
        title="开检查单"
        open={examModalOpen}
        onOk={handleCreateExamOrder}
        onCancel={() => setExamModalOpen(false)}
        width={600}
      >
        {selectedAppointment && (
          <p><strong>患者：</strong>{selectedAppointment.patientName}</p>
        )}
        <div style={{ marginBottom: 12 }}>
          <p style={{ marginBottom: 4 }}><strong>临床诊断（选填）：</strong></p>
          <Input value={clinicalDiag} onChange={(e) => setClinicalDiag(e.target.value)} placeholder="输入临床诊断" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 4 }}><strong>选择检查项目：</strong></p>
          <Select
            mode="multiple"
            placeholder="请选择检查项目"
            style={{ width: '100%' }}
            value={selectedExamItems}
            onChange={setSelectedExamItems}
            options={examItems.map((i) => ({
              label: `${i.name}（${i.category}）¥${i.price}`,
              value: i.id,
            }))}
          />
        </div>
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={handleCreateExamOrder}>开检查单</Button>
          <Button onClick={handleExamPrint}>打印检查单</Button>
        </Space>
        {examOrders.length > 0 && (
          <>
            <h4 style={{ marginTop: 16 }}>已开检查单</h4>
            <Table
              dataSource={examOrders}
              columns={[
                { title: '编号', dataIndex: 'id', key: 'id' },
                { title: '项目数', key: 'count', render: (_: any, r: any) => r.items.length },
                { title: '状态', dataIndex: 'status', key: 'status',
                  render: (s: string) => {
                    const m: Record<string, string> = { PENDING: '待缴费', PAID: '已缴费', IN_PROGRESS: '执行中', COMPLETED: '已完成' };
                    return <Tag>{m[s] || s}</Tag>;
                  },
                },
                { title: '开单时间', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => v.slice(0, 16) },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>
    </div>
  );
}
