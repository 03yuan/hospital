import { describe, it, expect } from 'vitest';
import { Appointment } from '../../../src/domain/entities/Appointment';
import { AppointmentStatus } from '../../../src/domain/enums';

describe('Appointment', () => {
  const validProps = {
    patientId: 1,
    doctorId: 1,
    departmentId: 1,
    scheduleId: 1,
    date: new Date('2026-06-01'),
    hour: 9,
  };

  it('should create with default PENDING status', () => {
    const apt = new Appointment(validProps);
    expect(apt.patientId).toBe(1);
    expect(apt.doctorId).toBe(1);
    expect(apt.departmentId).toBe(1);
    expect(apt.status).toBe(AppointmentStatus.PENDING);
  });

  it('should return date as ISO string', () => {
    const apt = new Appointment(validProps);
    expect(apt.getDateString()).toBe('2026-06-01');
  });

  it('should cancel when PENDING', () => {
    const apt = new Appointment(validProps);
    apt.cancel();
    expect(apt.status).toBe(AppointmentStatus.CANCELLED);
  });

  it('should throw when cancelling a VISITED appointment', () => {
    const apt = new Appointment(validProps);
    apt.markVisited();
    expect(() => apt.cancel()).toThrow('Cannot cancel a VISITED appointment');
  });

  it('should throw when cancelling a NO_SHOW appointment', () => {
    const apt = new Appointment(validProps);
    apt.markNoShow();
    expect(() => apt.cancel()).toThrow('Cannot cancel a NO_SHOW appointment');
  });

  it('should throw when cancelling a CANCELLED appointment', () => {
    const apt = new Appointment(validProps);
    apt.cancel();
    expect(() => apt.cancel()).toThrow('Cannot cancel a CANCELLED appointment');
  });

  it('should mark as visited', () => {
    const apt = new Appointment(validProps);
    apt.markVisited();
    expect(apt.status).toBe(AppointmentStatus.VISITED);
  });

  it('should throw when marking visited on cancelled appointment', () => {
    const apt = new Appointment(validProps);
    apt.cancel();
    expect(() => apt.markVisited()).toThrow('Cannot mark a CANCELLED appointment as visited');
  });

  it('should mark as no-show', () => {
    const apt = new Appointment(validProps);
    apt.markNoShow();
    expect(apt.status).toBe(AppointmentStatus.NO_SHOW);
  });

  it('should throw when marking no-show on already visited', () => {
    const apt = new Appointment(validProps);
    apt.markVisited();
    expect(() => apt.markNoShow()).toThrow('Cannot mark a VISITED appointment as no-show');
  });

  it('should allow state transition from PENDING to CANCELLED', () => {
    const apt = new Appointment(validProps);
    expect(apt.canCancel()).toBe(true);
  });

  it('should not allow cancel after VISITED', () => {
    const apt = new Appointment(validProps);
    apt.markVisited();
    expect(apt.canCancel()).toBe(false);
  });
});
