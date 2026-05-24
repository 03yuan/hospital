import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { adminScheduleRouter } from '../../../src/routes/admin/schedules';

describe('Admin Schedule Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin/schedules', adminScheduleRouter);

  it('GET /api/admin/schedules - should reject without auth', async () => {
    const res = await request(app).get('/api/admin/schedules');
    expect(res.status).toBe(401);
  });
});
