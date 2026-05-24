import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from '../../../src/application/use-cases/auth/LoginUseCase';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';

describe('LoginUseCase', () => {
  const mockUserRepo: IUserRepository = {
    findByPhone: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const useCase = new LoginUseCase(mockUserRepo);

  it('should login successfully with correct password', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue({
      id: 1, phone: '13800138000', password: '123456', name: '张三',
      role: 'PATIENT' as any, status: 'ACTIVE' as any,
      disable: vi.fn(), enable: vi.fn(),
    });

    const result = await useCase.execute({ phone: '13800138000', password: '123456' });

    expect(result.user.phone).toBe('13800138000');
    expect(result.token).toBeDefined();
  });

  it('should reject when phone not found', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue(null);

    await expect(
      useCase.execute({ phone: '13900000000', password: '123456' }),
    ).rejects.toThrow('手机号未注册');
  });

  it('should reject wrong password', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue({
      id: 1, phone: '13800138000', password: '123456', name: '张三',
      role: 'PATIENT' as any, status: 'ACTIVE' as any,
      disable: vi.fn(), enable: vi.fn(),
    });

    await expect(
      useCase.execute({ phone: '13800138000', password: 'wrong' }),
    ).rejects.toThrow('密码错误');
  });
});
