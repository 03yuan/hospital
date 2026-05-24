import { describe, it, expect } from 'vitest';
import { User } from '../../../src/domain/entities/User';
import { Role, UserStatus } from '../../../src/domain/enums';

describe('User', () => {
  it('should create a patient with default role and status', () => {
    const user = new User({ phone: '13800138000', password: '123456', name: '张三' });
    expect(user.phone).toBe('13800138000');
    expect(user.name).toBe('张三');
    expect(user.role).toBe(Role.PATIENT);
    expect(user.status).toBe(UserStatus.ACTIVE);
  });

  it('should create a doctor with specified role', () => {
    const user = new User({ phone: '13900139000', password: '123456', name: '李医生', role: Role.DOCTOR });
    expect(user.role).toBe(Role.DOCTOR);
  });

  it('should create an admin with specified role', () => {
    const user = new User({ phone: '13000130000', password: 'admin123', name: '管理员', role: Role.ADMIN });
    expect(user.role).toBe(Role.ADMIN);
  });

  it('should disable user', () => {
    const user = new User({ phone: '13800138000', password: '123456', name: '张三' });
    user.disable();
    expect(user.status).toBe(UserStatus.DISABLED);
  });

  it('should enable user', () => {
    const user = new User({ phone: '13800138000', password: '123456', name: '张三' });
    user.disable();
    user.enable();
    expect(user.status).toBe(UserStatus.ACTIVE);
  });
});
