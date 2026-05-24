import { useEffect, useState } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorsByDepartment } from '../../api/doctors';
import { Doctor } from '../../types';

export default function DoctorListPage() {
  const { id } = useParams<{ id: string }>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getDoctorsByDepartment(parseInt(id)).then((res) => setDoctors(res.data));
  }, [id]);

  return (
    <div>
      <h2>选择医生</h2>
      <Row gutter={[16, 16]}>
        {doctors.map((doc) => (
          <Col key={doc.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              title={doc.name}
              onClick={() => navigate(`/patient/doctors/${doc.id}/book`)}
            >
              <Tag>{doc.title}</Tag>
              <p>{doc.description || '暂无简介'}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
