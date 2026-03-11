// types/global.d.ts
export {};

declare global {
  type Config = {
    [key: string]: any;
  };
  function config(
    path: DotPath,
  ): string | number | boolean | Record<string, any> | null;
  function env(
    key: string,
  ): string | number | boolean | Record<string, any> | null;
  function redirect(url: string): Promise<any>;
}

import "./validation";
