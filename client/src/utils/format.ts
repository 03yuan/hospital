import { APPOINTMENT_STATUS_LABELS, ROLE_LABELS } from './constants';

export function formatDate(dateStr: string): string {
  return dateStr;
}

export function formatHour(hour: number): string {
  const start = String(hour).padStart(2, '0');
  const end = String(hour + 1).padStart(2, '0');
  return `${start}:00-${end}:00`;
}

export function formatStatus(status: string): string {
  return APPOINTMENT_STATUS_LABELS[status] || status;
}

export function formatRole(role: string): string {
  return ROLE_LABELS[role] || role;
}
