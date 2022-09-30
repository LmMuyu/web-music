export function p_promise() {
  const ps = [];

  const p = new Promise((resolve, rejects) => {
    ps.push(resolve);
    ps.push(rejects);
  });

  return {
    ps,
    p,
  };
}
