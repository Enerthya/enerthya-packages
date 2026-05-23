const buckets = new Map<string, Map<string, number>>();

function scope(key: string): Map<string, number> {
  if (!buckets.has(key)) buckets.set(key, new Map());
  return buckets.get(key)!;
}

export function setCooldown(bucket: string, sub: string, seconds: number): void {
  scope(bucket).set(sub, Date.now() + seconds * 1_000);
}

export function remaining(bucket: string, sub: string): number {
  const map = scope(bucket);
  const expiry = map.get(sub);

  if (!expiry) return 0;

  const left = expiry - Date.now();

  if (left <= 0) {
    map.delete(sub);
    return 0;
  }

  return Math.ceil(left / 1_000);
}

export function clearCooldown(bucket: string, sub?: string): void {
  if (sub) {
    scope(bucket).delete(sub);
  } else {
    buckets.delete(bucket);
  }
}

export function clearAll(): void {
  buckets.clear();
}
