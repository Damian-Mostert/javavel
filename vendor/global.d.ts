// types/global.d.ts
export {};

declare global {
  type AppConfig = {
    name: string;
    env: "development" | "production" | "testing";
    debug: boolean;
    url: string;
    port: number;
    timezone: string;
    locale: string;
  };

  type AuthConfig = {
    mode: "jwt" | "session";
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    guards: {
      web: string;
      api: string;
    };
  };

  type DatabaseConfig = {
    driver: "mysql" | "postgres" | "sqlite";
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    charset: string;
    collation: string;
  };

  type MailConfig = {
    provider: "smtp" | "sendgrid" | "mailgun";
    from: {
      address: string;
      name: string;
    };
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      encryption: "tls" | "ssl" | "none";
    };
  };

  type SocketsConfig = {
    enabled: boolean;
    port: number;
    cors: {
      origin: string;
      credentials: boolean;
    };
    authenticate: () => Promise<boolean>;
  };

  type StorageDisk = {
    driver: "local" | "s3";
    root: string;
    url?: string;
  };

  type StorageConfig = {
    default: string;
    disks: {
      [key: string]: StorageDisk;
    };
  };

  type ClientConfig = {
    appName: string;
  };

  type CmsConfig = {
    icon: string;
    theme: {
      background: string;
      forground: string;
      accent_1: string;
      accent_2: string;
      accent_3: string;
      icons: string;
    };
    middleware: any[];
  };

  type DebuggerConfig = {
    middleware: any[];
  };

  type Config = {
    [key: string]: any;
  };
  function config(
    path: DotPath,
    fallback?: any,
  ): string | number | boolean | Record<string, any> | null;
  function env(key: string, fallback?: any): any;
  function redirect(url: string): Promise<any>;
  type LayoutProps = {
    Children: () => React.ReactNode;
  };
  type ValidatorString =
    | "required"
    | "email"
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | "date"
    | "url"
    | "uuid"
    | "min:number"
    | "max:number"
    | "size:number"
    | "between:number,number"
    | "regex:pattern"
    | "confirmed"
    | "unique:table"
    | "unique:table,column"
    | "unique:table,column,except,id"
    | "exists:table"
    | "exists:table,column"
    | "in:value1,value2,value3"
    | "not_in:value1,value2,value3"
    | "nullable"
    | "distinct"
    | "json"
    | "ip"
    | "ipv4"
    | "ipv6"
    | "timezone"
    | "active_url"
    | "after:date"
    | "after_or_equal:date"
    | "before:date"
    | "before_or_equal:date"
    | "date_equals:date"
    | "date_format:format"
    | "different:field"
    | "ends_with:value1,value2"
    | "starts_with:value1,value2"
    | "file"
    | "mimes:mime1,mime2"
    | "image"
    | "dimensions:width=100,height=100"
    | "present"
    | "required_if:field,value"
    | "required_unless:field,value"
    | "required_with:field1,field2"
    | "required_with_all:field1,field2"
    | "required_without:field1,field2"
    | "required_without_all:field1,field2"
    | "same:field"
    | "sometimes"
    | "bail"
    | string;
}
