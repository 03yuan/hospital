import { Tag } from 'antd';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../utils/constants';

interface Props {
  status: string;
}

export function AppointmentStatusTag({ status }: Props) {
  return (
    <Tag color={APPOINTMENT_STATUS_COLORS[status] || 'default'}>
      {APPOINTMENT_STATUS_LABELS[status] || status}
    </Tag>
  );
}
