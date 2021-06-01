import { getSearch } from "../../../api/searchBox/index";

export async function onSearch(value: string, _retrunResDataFn: Function) {
  if (!value) return;
  value = value.trim();

  const result = await getSearch({
    url: "/search",
    params: {
      type: 1018,
      keywords: value,
    },
  });
  const order: string[] = result.data.result.order;

  const searchData: Record<string, any> = result.data.result;

  const searchDataFilterResList = order
    .map((key) => ({
      type: key,
      ...searchData[key],
    }))
    .slice(0, 3);

  _retrunResDataFn(value, searchDataFilterResList);
}

export function keyupEnter() {}
