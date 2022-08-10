export function historyList() {
  return new Array(10).fill(1).map((v, i) => <span key={i}>{i}</span>);
}
