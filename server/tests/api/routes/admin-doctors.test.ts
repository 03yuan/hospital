import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { adminDoctorRouter } from '../../../src/routes/admin/doctors';

describe('Admin Doctor Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin/doctors', adminDoctorRouter);

  it('GET /api/admin/doctors - should reject without auth', async () => {
    const res = await request(app).get('/api/admin/doctors');
    expect(res.status).toBe(401);
  });

  it('POST /api/admin/doctors - should reject without auth', async () => {
    const res = await request(app)
      .post('/api/admin/doctors')
      .send({ phone: '13800138000', name: '李医生', departmentId: 1, title: '主任医师' });
    expect(res.status).toBe(401);
  });
});
