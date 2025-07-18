export const API_ENDPOINTS = {
  ANALYZE: '/analyze',
  HEALTH: '/health',
} as const;

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
