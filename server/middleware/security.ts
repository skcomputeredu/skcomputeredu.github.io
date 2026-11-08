const headersToSet: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-dns-prefetch-control": "off",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

export default async function securityHeaders(
  _event: unknown,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (result instanceof Response) {
    for (const [key, value] of Object.entries(headersToSet)) {
      if (!result.headers.has(key)) result.headers.set(key, value);
    }
  }
  return result;
}
