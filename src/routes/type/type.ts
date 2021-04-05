export interface META {
  showTag?: boolean;
}

export interface Route {
  path: string;
  redirect?: string;
  name?: string;
  meta?: META;
  children?: Route[];
  component?: () => Promise<typeof import("*.vue")>;
}
