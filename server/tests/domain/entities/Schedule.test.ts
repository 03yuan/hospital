import { describe, it, expect } from 'vitest';
import { Schedule } from '../../../src/domain/entities/Schedule';

describe('Schedule', () => {
  it('should create with doctorId, date and hour', () => {
    const schedule = new Schedule({ doctorId: 1, date: new Date('2026-06-01'), hour: 9 });
    expect(schedule.doctorId).toBe(1);
    expect(schedule.hour).toBe(9);
  });

  it('should return date as ISO string', () => {
    const schedule = new Schedule({ doctorId: 1, date: new Date('2026-06-01'), hour: 9 });
    expect(schedule.getDateString()).toBe('2026-06-01');
  });

  it('should return formatted time slot label', () => {
    const schedule = new Schedule({ doctorId: 1, date: new Date('2026-06-01'), hour: 8 });
    expect(schedule.getTimeLabel()).toBe('08:00-09:00');
  });

  it('should reject hour less than 0', () => {
    expect(() => {
      new Schedule({ doctorId: 1, date: new Date('2026-06-01'), hour: -1 });
    }).toThrow('Hour must be between 0 and 23');
  });

  it('should reject hour greater than 23', () => {
    expect(() => {
      new Schedule({ doctorId: 1, date: new Date('2026-06-01'), hour: 24 });
    }).toThrow('Hour must be between 0 and 23');
  });
});
