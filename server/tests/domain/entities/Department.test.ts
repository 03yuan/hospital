import { describe, it, expect } from 'vitest';
import { Department } from '../../../src/domain/entities/Department';
import { DeptStatus } from '../../../src/domain/enums';

describe('Department', () => {
  it('should create with given name and description', () => {
    const dept = new Department({ name: '内科', description: '内科科室' });
    expect(dept.name).toBe('内科');
    expect(dept.description).toBe('内科科室');
    expect(dept.status).toBe(DeptStatus.ACTIVE);
  });

  it('should default description to empty string', () => {
    const dept = new Department({ name: '外科' });
    expect(dept.description).toBe('');
  });

  it('should set status to INACTIVE on deactivate', () => {
    const dept = new Department({ name: '内科' });
    dept.deactivate();
    expect(dept.status).toBe(DeptStatus.INACTIVE);
  });

  it('should set status to ACTIVE on activate', () => {
    const dept = new Department({ name: '内科' });
    dept.deactivate();
    dept.activate();
    expect(dept.status).toBe(DeptStatus.ACTIVE);
  });

  it('should update name and description', () => {
    const dept = new Department({ name: '内科' });
    dept.update({ name: '内科部', description: '更新描述' });
    expect(dept.name).toBe('内科部');
    expect(dept.description).toBe('更新描述');
  });
});
