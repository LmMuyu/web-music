export type Include<T, K extends keyof T> = { [P in K]: T[P] };

export interface OPTIONS {
  total: number;
  size: number;
}


export interface SendContent {
  content: string;
  reply: boolean;
  replyInfo: any;
}