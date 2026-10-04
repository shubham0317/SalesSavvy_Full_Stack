import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest } from '../apiClient';

describe('apiClient service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('performs GET request successfully with JSON response', async () => {
    const mockData = { id: 1, name: 'Product A' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    });

    const res = await apiRequest('/api/test');
    expect(res.ok).toBe(true);
    expect(res.data).toEqual(mockData);
  });

  it('handles server errors and returns normalized error object', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ error: 'Bad Request' })),
    });

    const res = await apiRequest('/api/error');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Bad Request');
  });
});
