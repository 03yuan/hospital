export interface ScheduleResponse {
  id: number;
  doctorId: number;
  date: string;
  hour: number;
}

export interface BatchScheduleRequest {
  doctorId: number;
  dateRange: { start: string; end: string };
  hourRanges: { start: number; end: number }[];
}
