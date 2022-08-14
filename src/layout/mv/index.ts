export const latestArea = ["内地", "港台", "欧美", "日本", "韩国"];

export class TopMv {
  imageurl: string;
  mid: number;
  query: Record<string, any>;
  hot: number;
  nicknames: Record<string, any>[];
  rank: "up" | "down" | "same";
  workname: string;

  constructor(data: any, rank: number) {
    this.nicknames = data.artists;
    this.mid = data.id;
    this.imageurl = data.cover;
    this.hot = data.score;
    this.rank =
      data.lastRank === -1
        ? "down"
        : data.lastRank === rank
        ? "same"
        : data.lastRank > rank
        ? "up"
        : "down";
    this.query = { mid: this.mid };
    this.workname = data.name;
  }
}
