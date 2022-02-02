export enum POSITION {
  CURR = "curr",
  PRE = "pre",
  NEXT = "next",
}


export interface PlayListOptions {
  id: number;
  playCount: number;
  name: string;
  creator: Record<string, any>;
  alg_sq_featured: string;
}