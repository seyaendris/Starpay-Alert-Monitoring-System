export function formatMsTimestampString(value: string | null | undefined) {
  if (!value) return "-";

  const ms = Number(value);
  if (Number.isNaN(ms)) return value;

  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(); 
}
