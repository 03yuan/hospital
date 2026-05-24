import { describe, it, expect, vi } from 'vitest';
import { roleGuard } from '../../../src/middleware/roleGuard';

function mockReq(role: string) {
  return { user: { role } } as any;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe('roleGuard', () => {
  it('should call next when role matches', () => {
    const req = mockReq('PATIENT');
    const res = mockRes();
    const next = vi.fn();

    const guard = roleGuard('PATIENT');
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when role does not match', () => {
    const req = mockReq('PATIENT');
    const res = mockRes();
    const next = vi.fn();

    const guard = roleGuard('ADMIN');
    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should accept multiple roles', () => {
    const req = mockReq('DOCTOR');
    const res = mockRes();
    const next = vi.fn();

    const guard = roleGuard('PATIENT', 'DOCTOR');
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
