export interface OPTIONS {
  on?: {
    onPlay: (sounid: number) => void;
    onPlayerror: () => void;
    onStop: () => void;
    onPause: () => void;
  };
}
