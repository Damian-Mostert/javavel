import { DotPath } from "./http";

export function config(path: DotPath, fallback?: any) {
    
}
export function env(key: string, def?: any) {
  return process.env[key] ?? def;
}

export function redirect(url: string) {}
