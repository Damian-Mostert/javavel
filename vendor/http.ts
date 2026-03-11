// types/global.d.ts
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

export type Req<TBody = any, TParams = any, TQuery = any> = {
  method: HttpMethod;
  url: string;
  body: TBody;
  query: TQuery;
  params: TParams;
  headers: Record<string, string>;
  input<K extends keyof TBody>(key: K): TBody[K];
  all(): TBody;
  only<K extends keyof TBody>(keys: K[]): Pick<TBody, K>;
  except<K extends keyof TBody>(keys: K[]): Omit<TBody, K>;
  has<K extends keyof TBody>(key: K): boolean;
  filled<K extends keyof TBody>(key: K): boolean;
  queryParam<K extends keyof TQuery>(key: K): TQuery[K];
  param<K extends keyof TParams>(key: K): TParams[K];
  validate(schema: Record<string, any>): TBody;
  user?: any;
  files?: Record<string, any>;
  ip?: string;
};
export type Res = {
  status(code: number): Res;
  json<T = any>(data?: T): T;
  text(data: string): string;
  html(html: string): string;
  headers(headers: Record<string, string>): Res;
  header(key: string, value: string): Res;
  redirect(url: string, status?: number): void;
  cookie(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      maxAge?: number;
      path?: string;
    },
  ): Res;

  clearCookie(name: string): Res;
  download(path: string, filename?: string): void;
  send(data?: any): void;
};

export type Callback = (
  req: Req,
  res: Res,
  next?: () => void,
) => Promise<void> | void;

export type DotPath = string;
export type RoutePath = `/${string}`;

export type Controllers = Record<string, Record<string, Callback>>;

export type ControllerAction<T extends Controllers = Controllers> = {
  [K in keyof T & string]: `controllers/${K}@${keyof T[K] & string}`;
}[keyof T & string];

export type MiddlewareAction<
  T extends Record<string, Record<string, Callback>> = {},
> = {
  [K in keyof T & string]: `middleware/${K}${keyof T[K] & string}`;
}[keyof T & string];

export type Action = ControllerAction;

export interface RouteApi {
  Get(path: RoutePath, handler: ControllerAction | Callback): void;
  Post(path: RoutePath, handler: ControllerAction | Callback): void;
  Group(
    prefix: RoutePath,
    callbackOrMiddleware:
      | ((this: { Route: RouteApi }) => void)
      | (string | string[]),
    callbackIfMiddleware?: (this: { Route: RouteApi }) => void,
  ): void;

  Middleware(
    middleware: MiddlewareAction | MiddlewareAction[],
    callback: (this: { Route: RouteApi }) => void,
  ): void;
}

export var Route: RouteApi;

export abstract class Controller<Keys extends string = string> {
  use?: string[];
  //@ts-ignore
  [key: Keys]: Callback | any;
}

export abstract class Middleware {
  use?: string[];
  //@ts-ignore
  name: string;
  abstract callback(
    req: Req,
    res: Res,
    next?: () => void,
  ): Promise<void> | void;
}
