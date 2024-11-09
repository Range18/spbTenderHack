export function IsIncludes(str: string, parts: string[]): boolean {
  const text = str.toLowerCase();
  return parts.some((part) => text.includes(part));
}
