const DEFAULT_MAX_BYTES = 16 * 1024;

export async function readJsonBody(request, maxBytes = DEFAULT_MAX_BYTES) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError('maxBytes must be a positive safe integer');
  }

  if (!request?.body) {
    return { ok: false, status: 400, error: 'بيانات الطلب غير صالحة.' };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // The body may already have been cancelled by the request runtime.
        }
        return { ok: false, status: 413, error: 'حجم بيانات الطلب أكبر من المسموح.' };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: 'تعذر قراءة بيانات الطلب.' };
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Ignore a lock that the runtime has already released.
    }
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(body);
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, error: 'بيانات الطلب غير صالحة.' };
  }
}
