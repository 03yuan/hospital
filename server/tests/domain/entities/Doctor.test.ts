import { describe, it, expect } from 'vitest';
import { Doctor } from '../../../src/domain/entities/Doctor';

describe('Doctor', () => {
  it('should create with userId, departmentId and title', () => {
    const doctor = new Doctor({ userId: 1, departmentId: 1, title: '主任医师' });
    expect(doctor.userId).toBe(1);
    expect(doctor.departmentId).toBe(1);
    expect(doctor.title).toBe('主任医师');
  });

  it('should default description to empty string', () => {
    const doctor = new Doctor({ userId: 1, departmentId: 1, title: '副主任医师' });
    expect(doctor.description).toBe('');
  });

  it('should accept optional description', () => {
    const doctor = new Doctor({ userId: 1, departmentId: 1, title: '主治医师', description: '擅长内科疾病' });
    expect(doctor.description).toBe('擅长内科疾病');
  });

  it('should update department', () => {
    const doctor = new Doctor({ userId: 1, departmentId: 1, title: '主任医师' });
    doctor.updateDepartment(2);
    expect(doctor.departmentId).toBe(2);
  });

  it('should update title', () => {
    const doctor = new Doctor({ userId: 1, departmentId: 1, title: '主任医师' });
    doctor.updateTitle('副主任医师');
    expect(doctor.title).toBe('副主任医师');
  });
});
