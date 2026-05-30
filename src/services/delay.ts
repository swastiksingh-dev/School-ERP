export function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
