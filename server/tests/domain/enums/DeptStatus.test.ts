import { describe, it, expect } from 'vitest';
import { DeptStatus } from '../../../src/domain/enums';

describe('DeptStatus', () => {
  it('should have ACTIVE value', () => {
    expect(DeptStatus.ACTIVE).toBe('ACTIVE');
  });

  it('should have INACTIVE value', () => {
    expect(DeptStatus.INACTIVE).toBe('INACTIVE');
  });
});
