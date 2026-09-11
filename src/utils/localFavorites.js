const STORAGE_KEY = "insanjo_local_favorites";

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
};

export const isLocalFavorite = (productId) => readAll().includes(productId);

export const toggleLocalFavorite = (productId) => {
  const current = readAll();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  writeAll(next);
  return next.includes(productId);
};
