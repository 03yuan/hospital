import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { adminStatisticsRouter } from '../../../src/routes/admin/statistics';

describe('Admin Statistics Routes', () => {
  const app = express();
  app.use('/api/admin/statistics', adminStatisticsRouter);

  it('GET /api/admin/statistics/appointments - should reject without auth', async () => {
    const res = await request(app).get('/api/admin/statistics/appointments');
    expect(res.status).toBe(401);
  });
});
