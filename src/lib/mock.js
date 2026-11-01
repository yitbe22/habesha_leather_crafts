/**
 * Helpers for the mock service layer. They make local data behave like a
 * Supabase query: async, a little latency, and a `{ data, error }` result.
 * Delete this file together with src/data when moving to Supabase.
 */
export const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export const ok = (data, extra = {}) => ({ data, error: null, ...extra })

export const fail = (message, code = 'MOCK_ERROR') => ({ data: null, error: { message, code } })

/** Deep copy, so callers can never mutate the mock "database". */
export const clone = (value) => structuredClone(value)
