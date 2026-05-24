import { useEffect, useState } from 'react';
import { Calendar, Button, Card, List, message, Badge } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { getSchedules, getSchedulesByMonth } from '../../api/schedules';
import { Schedule } from '../../types';
import { formatHour } from '../../utils/format';
import type { Dayjs as DayjsType } from 'dayjs';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());

  const fetchMonthData = async (month: string) => {
    if (!id) return;
    try {
      const res = await getSchedulesByMonth(parseInt(id), month);
      const dates = new Set(res.data.map((s: Schedule) => s.date));
      setAvailableDates(dates);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMonthData(dayjs().format('YYYY-MM'));
  }, [id]);

  const handleMonthChange = (date: DayjsType) => {
    fetchMonthData(date.format('YYYY-MM'));
  };

  const handleDateSelect = async (date: DayjsType) => {
    const dateStr = date.format('YYYY-MM-DD');
    setSelectedDate(dateStr);
    setSelectedHour(null);
    if (!id) return;
    try {
      const res = await getSchedules(parseInt(id), dateStr);
      setSchedules(res.data);
    } catch {
      message.error('获取排班信息失败');
    }
  };

  const handleBook = () => {
    if (!selectedDate || selectedHour === null || !id) return;
    navigate('/patient/book/confirm', {
      state: {
        doctorId: parseInt(id),
        date: selectedDate,
        hour: selectedHour,
        scheduleId: schedules.find((s) => s.hour === selectedHour)?.id,
      },
    });
  };

  const dateCellRender = (date: DayjsType) => {
    const dateStr = date.format('YYYY-MM-DD');
    if (availableDates.has(dateStr)) {
      return <Badge status="success" text="" />;
    }
    return null;
  };

  return (
    <div>
      <h2>选择就诊时间</h2>
      <Card style={{ marginBottom: 16 }}>
        <Calendar
          fullscreen={false}
          onSelect={handleDateSelect}
          onPanelChange={handleMonthChange}
          cellRender={dateCellRender}
          defaultValue={dayjs()}
        />
      </Card>

      {selectedDate && (
        <>
          <div style={{ marginBottom: 8 }}>
            已选日期：<strong>{selectedDate}</strong>
            {availableDates.has(selectedDate) ? ' ✅ 有排班' : ' ❌ 该日无排班'}
          </div>
          <List
            header={<div>可选时段</div>}
            dataSource={schedules}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelectedHour(item.hour)}
                style={{
                  cursor: 'pointer',
                  background: selectedHour === item.hour ? '#e6f7ff' : undefined,
                }}
              >
                {formatHour(item.hour)}
              </List.Item>
            )}
          />
          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: 16 }}
            disabled={selectedHour === null}
            onClick={handleBook}
          >
            确认预约
          </Button>
        </>
      )}
    </div>
  );
}
