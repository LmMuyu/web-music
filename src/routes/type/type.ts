interface Container {
  main?: boolean;
  header?: boolean;
  center?: boolean;
  footer?: boolean;
}

export interface META {
  showTag?: boolean;
  defaultView?: [string, string?];
  mainContentOptions?: {
    left?: Container;
    right?: Container;
  };
}

export interface Route {
  path: string;
  redirect?: string;
  name?: string;
  meta?: META;
  children?: Route[];
  component?: () => Promise<typeof import("*.vue")>;
}
