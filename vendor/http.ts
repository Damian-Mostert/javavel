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
  render(
    layout: string,
    page: string,
    props: {
      metadata: {
        title?: string;
        description?: string;
        favicon?: string;
        viewport?: string;
      };
      [key: string]: any;
    },
  ): string;
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

export type Callback = (req: Req, res: Res, next?: () => void) => any;

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

export class RouteApi {
  private routes: any[] = [];
  private currentPrefix: string = "";
  private currentMiddleware: string[] = [];

  Get(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("GET", path, handler);
  }

  Post(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("POST", path, handler);
  }

  Put(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("PUT", path, handler);
  }

  Patch(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("PATCH", path, handler);
  }

  Delete(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("DELETE", path, handler);
  }

  Options(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("OPTIONS", path, handler);
  }

  Head(path: RoutePath, handler: ControllerAction | Callback): void {
    this.addRoute("HEAD", path, handler);
  }

  Any(path: RoutePath, handler: ControllerAction | Callback): void {
    ["GET", "POST", "PUT", "PATCH", "DELETE"].forEach((method) => {
      this.addRoute(method, path, handler);
    });
  }

  Group(
    prefix: RoutePath,
    callbackOrMiddleware:
      | ((this: { Route: RouteApi }) => void)
      | (string | string[]),
    callbackIfMiddleware?: (this: { Route: RouteApi }) => void,
  ): void {
    const previousPrefix = this.currentPrefix;
    this.currentPrefix += prefix;

    if (typeof callbackOrMiddleware === "function") {
      callbackOrMiddleware.call({ Route: this });
    } else {
      const middleware = Array.isArray(callbackOrMiddleware)
        ? callbackOrMiddleware
        : [callbackOrMiddleware];
      const previousMiddleware = this.currentMiddleware;
      this.currentMiddleware = [...this.currentMiddleware, ...middleware];
      callbackIfMiddleware?.call({ Route: this });
      this.currentMiddleware = previousMiddleware;
    }

    this.currentPrefix = previousPrefix;
  }

  Middleware(
    middleware: string | string[],
    callback: (this: { Route: RouteApi }) => void,
  ): void {
    const previousMiddleware = this.currentMiddleware;
    const mw = Array.isArray(middleware) ? middleware : [middleware];
    this.currentMiddleware = [...this.currentMiddleware, ...mw];
    callback.call({ Route: this });
    this.currentMiddleware = previousMiddleware;
  }

  private addRoute(
    method: string,
    path: RoutePath,
    handler: ControllerAction | Callback,
  ): void {
    const fullPath = this.currentPrefix + path;
    const regex = this.pathToRegex(fullPath);

    this.routes.push({
      method,
      path: fullPath,
      regex,
      handler,
      middleware: [...this.currentMiddleware],
    });
  }

  private pathToRegex(path: string): RegExp {
    const pattern = path
      .replace(/\{([^}]+)\}/g, "(?<$1>[^/]+)")
      .replace(/\//g, "\\/");
    return new RegExp(`^${pattern}$`);
  }

  match(method: string, path: string): any {
    return this.routes.find(
      (route) =>
        route.method === method.toUpperCase() && route.regex.test(path),
    );
  }

  extractParams(path: string, route: any): Record<string, string> {
    const match = path.match(route.regex);
    return match?.groups || {};
  }

  getRoutes() {
    return this.routes;
  }
}

export const Route = new RouteApi();

export abstract class Controller<Keys extends string = string> {
  //@ts-ignore
  [key: Keys]: Callback | any;
}

export abstract class Middleware {
  //@ts-ignore
  name: string;
  abstract callback(req: Req, res: Res, next?: () => void): any;
}
