import { describe, it, expect, vi } from 'vitest';
import { RegisterUseCase } from '../../../src/application/use-cases/auth/RegisterUseCase';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';

describe('RegisterUseCase', () => {
  const mockUserRepo: IUserRepository = {
    findByPhone: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const useCase = new RegisterUseCase(mockUserRepo);

  it('should register a new patient', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue(null);
    vi.mocked(mockUserRepo.create).mockResolvedValue({
      id: 1, phone: '13800138000', password: '123456', name: '张三',
      role: 'PATIENT' as any, status: 'ACTIVE' as any,
      disable: vi.fn(), enable: vi.fn(),
    });

    const result = await useCase.execute({ phone: '13800138000', password: '123456', name: '张三' });

    expect(result.user.phone).toBe('13800138000');
    expect(result.user.name).toBe('张三');
    expect(result.user.role).toBe('PATIENT');
    expect(result.token).toBeDefined();
  });

  it('should reject duplicate phone', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue({ id: 1 } as any);

    await expect(
      useCase.execute({ phone: '13800138000', password: '123456', name: '张三' }),
    ).rejects.toThrow('手机号已注册');
  });
});
