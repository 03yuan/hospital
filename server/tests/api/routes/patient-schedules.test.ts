import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { scheduleRouter } from '../../../src/routes/schedules';

describe('Patient Schedule Routes', () => {
  const app = express();
  app.use('/api/doctors', scheduleRouter);

  it('GET /api/doctors/:id/schedules - should return schedules', async () => {
    const res = await request(app).get('/api/doctors/1/schedules?date=2026-06-01');
    expect(res.status).toBe(200);
  });
});
