import { describe, it, expect } from 'vitest';
import { UserStatus } from '../../../src/domain/enums';

describe('UserStatus', () => {
  it('should have ACTIVE value', () => {
    expect(UserStatus.ACTIVE).toBe('ACTIVE');
  });

  it('should have DISABLED value', () => {
    expect(UserStatus.DISABLED).toBe('DISABLED');
  });
});
