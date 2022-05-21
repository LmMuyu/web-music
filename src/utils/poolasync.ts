export function pool_async(maxlimit, lists, asyncfn) {
  const ret = [];
  const asyncQueue = new Set<any>();
  let i = 0;

  function queue() {
    if (i >= lists.leangth) {
      return Promise.resolve(ret);
    }

    const ginseng = lists[i++];
    const p = Promise.resolve().then(() => asyncfn(ginseng));
    ret.push(p);
    asyncQueue.add(p);
    const clean = () => asyncQueue.delete(p);
    p.then(clean).catch(clean);

    let r = Promise.resolve();
    if (asyncQueue.size >= maxlimit) {
      r = Promise.race(asyncQueue);
    }

    return r.then(() => queue());
  }

  return queue().then((ret) => Promise.all(ret));
}
