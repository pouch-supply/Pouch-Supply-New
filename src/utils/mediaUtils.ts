export function cleanMediaUrl(url?: string): string {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  // Convert any domain prefix like http://localhost:3000/uploads/... or https://pouch-supply.com/uploads/... to relative /uploads/... or /api/images/...
  if (url.includes('/uploads/') || url.includes('/api/images/')) {
    return url.replace(/^https?:\/\/[^/]+(\/(?:uploads|api\/images)\/.+)$/, '$1');
  }
  return url;
}
