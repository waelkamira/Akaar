export function ok(data, extra = {}) {
  return { success: true, data, error: null, ...extra };
}

export function fail(error, extra = {}) {
  return { success: false, data: null, error, ...extra };
}
