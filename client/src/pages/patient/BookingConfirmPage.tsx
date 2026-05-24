import { useState } from 'react';
import { Card, Button, Descriptions, Input, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAppointment } from '../../api/appointments';
import { formatHour } from '../../utils/format';

const { TextArea } = Input;

interface BookingState {
  doctorId: number;
  date: string;
  hour: number;
  scheduleId: number;
}

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingState;
  const [symptom, setSymptom] = useState('');

  if (!state) {
    return <div>请先选择预约信息</div>;
  }

  const handleConfirm = async () => {
    try {
      await createAppointment({
        doctorId: state.doctorId,
        scheduleId: state.scheduleId,
        date: state.date,
        hour: state.hour,
        symptom: symptom || undefined,
      });
      message.success('预约成功');
      navigate('/patient/appointments');
    } catch {
      message.error('预约失败，请重试');
    }
  };

  return (
    <div>
      <h2>确认预约信息</h2>
      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="就诊日期">{state.date}</Descriptions.Item>
          <Descriptions.Item label="就诊时段">{formatHour(state.hour)}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>病情描述（选填）</div>
          <TextArea
            rows={3}
            placeholder="请描述您的症状、持续时间等..."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />
        </div>
        <Button type="primary" size="large" block onClick={handleConfirm} style={{ marginTop: 16 }}>
          确认预约
        </Button>
      </Card>
    </div>
  );
}
