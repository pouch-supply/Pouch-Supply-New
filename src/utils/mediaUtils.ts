export function cleanMediaUrl(url?: string): string {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (trimmed.includes('/uploads/') || trimmed.includes('/api/images/')) {
    trimmed = trimmed.replace(/^https?:\/\/[^/]+(\/(?:uploads|api\/images)\/.+)$/, '$1');
  }
  if (trimmed.startsWith('uploads/') || trimmed.startsWith('api/images/')) {
    trimmed = '/' + trimmed;
  }
  return trimmed;
}

export function cleanBase64String(raw: string): string {
  if (!raw) return '';
  if (raw.includes(';base64,')) {
    return raw.split(';base64,').pop() || raw;
  }
  return raw.replace(/^data:[^;]+;base64,/, '').trim();
}

