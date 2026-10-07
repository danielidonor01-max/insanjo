/**
 * Where to send the vendor after login/signup. Only same-site paths are allowed,
 * so a crafted ?next=https://evil.example link can't bounce users off-site.
 */
export function getSafeNext(searchParams, fallback = '/invite') {
  const next = searchParams.get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

/** Carry ?next= across the login <-> signup links. */
export function withNext(path, searchParams) {
  const next = searchParams.get('next');
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
