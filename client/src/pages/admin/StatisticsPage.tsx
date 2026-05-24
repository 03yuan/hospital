import { useEffect, useState } from 'react';
import { Card, DatePicker, Statistic, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { getAppointmentStats } from '../../api/admin';

const { RangePicker } = DatePicker;

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async (start?: string, end?: string) => {
    const res = await getAppointmentStats(start, end);
    setStats(res.data);
  };

  useEffect(() => {
    const end = dayjs().format('YYYY-MM-DD');
    const start = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    fetchStats(start, end);
  }, []);

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      fetchStats(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
    }
  };

  return (
    <div>
      <h2>数据统计</h2>
      <RangePicker onChange={handleRangeChange} style={{ marginBottom: 16 }} />

      {stats && (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic title="总预约量" value={stats.totalAppointments} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="取消率" value={stats.cancellationRate} suffix="%" precision={2} />
            </Card>
          </Col>
        </Row>
      )}

      {stats?.byDepartment && (
        <Card title="科室预约量" style={{ marginTop: 16 }}>
          {stats.byDepartment.map((d: any) => (
            <div key={d.departmentName} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>{d.departmentName}</span>
              <span>{d.count} 次</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
