export const API_BASE_URL = '/api';

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: '待就诊',
  VISITED: '已就诊',
  NO_SHOW: '未到',
  CANCELLED: '已取消',
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'processing',
  VISITED: 'success',
  NO_SHOW: 'error',
  CANCELLED: 'default',
};

export const ROLE_LABELS: Record<string, string> = {
  PATIENT: '患者',
  DOCTOR: '医生',
  ADMIN: '管理员',
};
