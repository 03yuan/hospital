import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../../../src/middleware/auth';
import { verifyToken } from '../../../src/utils/jwt';

vi.mock('../../../src/utils/jwt');

function mockReq(headers: Record<string, string> = {}) {
  return { headers } as any;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe('authMiddleware', () => {
  it('should return 401 when no Authorization header', () => {
    const req = mockReq({});
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    const req = mockReq({ authorization: 'Bearer invalid' });
    const res = mockRes();
    const next = vi.fn();

    vi.mocked(verifyToken).mockImplementation(() => { throw new Error('Invalid token'); });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should call next and set req.user when token is valid', () => {
    const req = mockReq({ authorization: 'Bearer valid-token' });
    const res = mockRes();
    const next = vi.fn();

    vi.mocked(verifyToken).mockReturnValue({ userId: 1, phone: '13800138000', role: 'PATIENT' });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe(1);
  });
});
