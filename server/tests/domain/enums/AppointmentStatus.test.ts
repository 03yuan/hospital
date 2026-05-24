import { describe, it, expect } from 'vitest';
import { AppointmentStatus } from '../../../src/domain/enums';

describe('AppointmentStatus', () => {
  it('should have PENDING value', () => {
    expect(AppointmentStatus.PENDING).toBe('PENDING');
  });

  it('should have VISITED value', () => {
    expect(AppointmentStatus.VISITED).toBe('VISITED');
  });

  it('should have NO_SHOW value', () => {
    expect(AppointmentStatus.NO_SHOW).toBe('NO_SHOW');
  });

  it('should have CANCELLED value', () => {
    expect(AppointmentStatus.CANCELLED).toBe('CANCELLED');
  });
});
