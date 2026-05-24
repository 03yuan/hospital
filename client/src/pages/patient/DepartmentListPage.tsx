import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getDepartments } from '../../api/departments';
import { Department } from '../../types';

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments().then((res) => setDepartments(res.data));
  }, []);

  return (
    <div>
      <h2>选择科室</h2>
      <Row gutter={[16, 16]}>
        {departments.map((dept) => (
          <Col key={dept.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title={dept.name}
              onClick={() => navigate(`/patient/departments/${dept.id}`)}
            >
              {dept.description || '暂无描述'}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
