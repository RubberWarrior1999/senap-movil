export function parseLiters(text: string) {
  const normalized = text.trim().replace(',', '.');
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 ? value : null;
}
