import { Card, Button, Space, Tag } from 'antd';
import { AppointmentStatusTag } from './AppointmentStatusTag';
import { formatHour } from '../../utils/format';

interface Props {
  id: number;
  departmentName: string;
  doctorName: string;
  date: string;
  hour: number;
  status: string;
  symptom?: string;
  diagnosis?: string;
  onCancel?: (id: number) => void;
  onViewDetail?: (id: number) => void;
}

export function AppointmentCard({ id, departmentName, doctorName, date, hour, status, symptom, diagnosis, onCancel, onViewDetail }: Props) {
  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{departmentName} - {doctorName}</strong>
          <AppointmentStatusTag status={status} />
        </div>
        <div>
          {date} {formatHour(hour)}
        </div>
        {symptom && (
          <div style={{ color: '#666', fontSize: 13 }}>
            <Tag color="blue" style={{ marginRight: 4 }}>病情描述</Tag>
            {symptom}
          </div>
        )}
        {status === 'VISITED' && diagnosis && (
          <div style={{ color: '#666', fontSize: 13 }}>
            <Tag color="green" style={{ marginRight: 4 }}>诊断</Tag>
            {diagnosis}
          </div>
        )}
        {status === 'PENDING' && onCancel && (
          <Button size="small" danger onClick={() => onCancel(id)}>
            取消预约
          </Button>
        )}
        {status === 'VISITED' && onViewDetail && (
          <Button size="small" type="link" onClick={() => onViewDetail(id)}>
            查看处方详情
          </Button>
        )}
      </Space>
    </Card>
  );
}
