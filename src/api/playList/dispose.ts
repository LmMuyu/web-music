import LRU from "../../layout/explore/LRUCache";

export function disposeLRU<T extends LRU>(lru: T, key: any, data?: any) {
  const dataNode = lru.get(key);

  if (dataNode !== -1) {
    return dataNode;
  } else {
    lru.put(key, data);
    return -1;
  }
}
