import { describe, it, expect } from 'vitest';
import { CreateAppointmentRequest } from '../../../src/application/dtos/appointment.dto';

describe('Appointment DTOs', () => {
  it('should create CreateAppointmentRequest', () => {
    const dto: CreateAppointmentRequest = {
      doctorId: 1,
      scheduleId: 5,
      date: '2026-06-01',
      hour: 9,
    };
    expect(dto.doctorId).toBe(1);
    expect(dto.scheduleId).toBe(5);
    expect(dto.date).toBe('2026-06-01');
    expect(dto.hour).toBe(9);
  });
});
