export async function async_pool(
  requestList: any[],
  maxlimit: number = 2,
  iteratorFn: (reqeust: any) => Promise<unknown> = iterFn
) {
  const result = [];
  const executing = [];

  for (const req of requestList) {
    const p = Promise.resolve().then(() => iteratorFn(req));
    result.push(p);

    if (maxlimit <= requestList.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);

      if (executing.length >= maxlimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(result);
}

const iterFn = (reqeust: any) => new Promise((resolve) => resolve(reqeust));
