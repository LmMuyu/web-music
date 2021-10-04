export interface Container {
  subject?: boolean;
  header?: boolean;
  center?: boolean;
  footer?: boolean;
  width?: number;
}

export interface META {
  showTags?: boolean;
  defaultView?: [string, string?];
  setting?: {
    left?: Container;
    right?: Container;
  };
  fetchCount?:number
}

export interface Route {
  path: string;
  redirect?: string;
  name?: string;
  meta?: META;
  children?: Route[];
  component?: () => Promise<typeof import("*.vue")>;
}
