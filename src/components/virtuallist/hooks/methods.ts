import type { EstimateType } from "../type";

export function getEachEstimateInfo(
  height: number,
  renderData: Array<any>
): EstimateType[] {
  return renderData.map((v, i) => ({
    i,
    height,
    top: i * height,
    bottom: (i + 1) * height,
  }));
}
