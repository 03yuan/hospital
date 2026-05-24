import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { appointmentRouter } from '../../../src/routes/appointments';

describe('Patient Appointment Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', appointmentRouter);

  it('POST /api/appointments - should reject without auth', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctorId: 1, scheduleId: 1, date: '2026-06-01', hour: 9 });
    expect(res.status).toBe(401);
  });

  it('GET /api/appointments - should reject without auth', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });
});
