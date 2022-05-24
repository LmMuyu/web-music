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
  fetchCount?: number;
  padding?: "none" | string | number | Record<string, string>;
  showtiao?: boolean;
  query?: string[];
  params?: string[];
  isnavindex?: boolean;
  mainhidden?: boolean;
}

export interface Route {
  path: string;
  redirect?: string;
  name?: string;
  meta?: META;
  children?: Route[];
  component?: () => Promise<typeof import("*.vue")>;
}
