import { describe, it, expect } from 'vitest';
import { RegisterRequest, LoginRequest } from '../../../src/application/dtos/auth.dto';

describe('Auth DTOs', () => {
  it('should create RegisterRequest', () => {
    const dto: RegisterRequest = { phone: '13800138000', password: '123456', name: '张三' };
    expect(dto.phone).toBe('13800138000');
    expect(dto.password).toBe('123456');
    expect(dto.name).toBe('张三');
  });

  it('should create LoginRequest', () => {
    const dto: LoginRequest = { phone: '13800138000', password: '123456' };
    expect(dto.phone).toBe('13800138000');
    expect(dto.password).toBe('123456');
  });
});
