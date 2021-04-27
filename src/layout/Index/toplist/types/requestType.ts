export interface ListItem {
  id: number;
  name: string;
  commentCount: number;
  shareCount: number;
  tracks: Record<string, any>[];
  trackUpdateTime:string 
}
