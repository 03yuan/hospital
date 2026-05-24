import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Timeline, Tag, message, Descriptions, List, Button } from 'antd';
import { getPatientHistory } from '../../api/profile';
import { PatientHistory } from '../../types';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../utils/constants';

export default function PatientHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PatientHistory | null>(null);

  useEffect(() => {
    if (!id) return;
    getPatientHistory(parseInt(id)).then((res) => {
      setData(res.data);
    }).catch((err) => {
      message.error(err?.response?.data?.message || '获取就诊历史失败');
    });
  }, [id]);

  if (!data) return <div>加载中...</div>;

  return (
    <div>
      <Button type="link" style={{ marginBottom: 8, padding: 0 }} onClick={() => navigate(-1)}>← 返回</Button>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="患者信息" column={2}>
          <Descriptions.Item label="姓名">{data.patient.name}</Descriptions.Item>
          <Descriptions.Item label="电话">{data.patient.phone}</Descriptions.Item>
          <Descriptions.Item label="就诊次数">{data.appointments.length} 次</Descriptions.Item>
        </Descriptions>
      </Card>

      <h3>就诊历史</h3>
      <Timeline
        items={data.appointments.map((apt) => ({
          color: apt.status === 'VISITED' ? 'green' : apt.status === 'CANCELLED' ? 'gray' : 'red',
          children: (
            <Card size="small" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{apt.date}</strong>
                <Tag color={APPOINTMENT_STATUS_COLORS[apt.status]}>{APPOINTMENT_STATUS_LABELS[apt.status]}</Tag>
              </div>
              <p style={{ margin: '4px 0' }}>{apt.departmentName} - {apt.doctorName}</p>
              {apt.diagnosis && <p><strong>诊断：</strong>{apt.diagnosis}</p>}
              {apt.prescriptions.length > 0 && (
                <div>
                  <strong>处方：</strong>
                  <List
                    size="small"
                    dataSource={apt.prescriptions}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '2px 0' }}>
                        {item.medicineName} — {item.dosage}，{item.method}，共{item.days}天
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>
          ),
        }))}
      />
    </div>
  );
}
