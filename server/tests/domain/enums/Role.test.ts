import { describe, it, expect } from 'vitest';
import { Role } from '../../../src/domain/enums';

describe('Role', () => {
  it('should have PATIENT value', () => {
    expect(Role.PATIENT).toBe('PATIENT');
  });

  it('should have DOCTOR value', () => {
    expect(Role.DOCTOR).toBe('DOCTOR');
  });

  it('should have ADMIN value', () => {
    expect(Role.ADMIN).toBe('ADMIN');
  });
});
