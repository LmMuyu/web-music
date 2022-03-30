export type hookname = "onPlayerror" | "onPlay" | "onStop" | "onPause"  | "onEnd";

export type SetHook<T extends string> = { [P in T]?: (args: any) => void };

export type OPTIONS_ON = Readonly<SetHook<hookname>>;

export interface OPTIONS {
  mute?: boolean;
  on?: OPTIONS_ON;
}
