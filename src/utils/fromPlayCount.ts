export function fromPlayCount(count: number) {
  if (!count) return;
  if (count >= 100000000) {
    return `${Math.floor((count / 100000000) * 100) / 100}亿`;
  } else if (count >= 100000) {
    return `${Math.floor((count / 100000) * 100) / 100}万`;
  } else if (count >= 10000) {
    return `${Math.floor((count / 10000) * 100) / 100}万`;
  }
}
