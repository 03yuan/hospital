import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { doctorAppointmentRouter } from '../../../src/routes/doctor/appointments';

describe('Doctor Appointment Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/doctor/appointments', doctorAppointmentRouter);

  it('GET /api/doctor/appointments - should reject without auth', async () => {
    const res = await request(app).get('/api/doctor/appointments');
    expect(res.status).toBe(401);
  });

  it('PATCH /api/doctor/appointments/:id/status - should reject without auth', async () => {
    const res = await request(app)
      .patch('/api/doctor/appointments/1/status')
      .send({ status: 'VISITED' });
    expect(res.status).toBe(401);
  });
});
