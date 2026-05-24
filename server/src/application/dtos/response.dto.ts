export interface ApiResponse<T> {
  code: number;
  data: T | null;
  message: string;
}

export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, data, message };
}

export function failure(code: number, message: string): ApiResponse<null> {
  return { code, data: null, message };
}
