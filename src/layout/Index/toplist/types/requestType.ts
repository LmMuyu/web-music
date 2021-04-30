export type TrackUpdateTimeObj = Record<string, number>;

export interface ListItem {
  id: number;
  name: string;
  select: boolean;
  shareCount: number;
  commentCount: number;
  tracks: Record<string, any>[];
  trackUpdateTime: TrackUpdateTimeObj;
}
