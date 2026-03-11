import { promises as fs } from "fs";
import { join, dirname } from "path";

export type StorageVisibility = "public" | "private";

export type StoragePutOptions = {
  visibility?: StorageVisibility;
  contentType?: string;
};

export type StorageFileMeta = {
  size: number;
  lastModified: number;
  contentType?: string;
};

export abstract class StorageDriver {
  abstract put(
    path: string,
    contents: string | Buffer,
    options?: StoragePutOptions,
  ): Promise<void>;

  abstract get(path: string): Promise<Buffer>;

  abstract delete(path: string): Promise<void>;

  abstract exists(path: string): Promise<boolean>;

  abstract url(path: string): string;

  abstract size(path: string): Promise<number>;

  abstract meta(path: string): Promise<StorageFileMeta>;

  abstract copy(from: string, to: string): Promise<void>;

  abstract move(from: string, to: string): Promise<void>;
}

export class LocalStorageDriver extends StorageDriver {
  constructor(
    private root: string,
    private baseUrl?: string,
  ) {
    super();
  }

  private resolvePath(path: string): string {
    return join(process.cwd(), this.root, path);
  }

  async put(path: string, contents: string | Buffer, options?: StoragePutOptions): Promise<void> {
    const fullPath = this.resolvePath(path);
    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, contents);
  }

  async get(path: string): Promise<Buffer> {
    return await fs.readFile(this.resolvePath(path));
  }

  async delete(path: string): Promise<void> {
    await fs.unlink(this.resolvePath(path));
  }

  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(this.resolvePath(path));
      return true;
    } catch {
      return false;
    }
  }

  url(path: string): string {
    return this.baseUrl ? `${this.baseUrl}/${path}` : path;
  }

  async size(path: string): Promise<number> {
    const stats = await fs.stat(this.resolvePath(path));
    return stats.size;
  }

  async meta(path: string): Promise<StorageFileMeta> {
    const stats = await fs.stat(this.resolvePath(path));
    return {
      size: stats.size,
      lastModified: stats.mtimeMs,
    };
  }

  async copy(from: string, to: string): Promise<void> {
    const toPath = this.resolvePath(to);
    await fs.mkdir(dirname(toPath), { recursive: true });
    await fs.copyFile(this.resolvePath(from), toPath);
  }

  async move(from: string, to: string): Promise<void> {
    const toPath = this.resolvePath(to);
    await fs.mkdir(dirname(toPath), { recursive: true });
    await fs.rename(this.resolvePath(from), toPath);
  }
}

class StorageManager {
  private drivers: Map<string, StorageDriver> = new Map();
  private defaultDisk: string = "local";

  disk(name?: string): StorageDriver {
    const diskName = name || this.defaultDisk;
    if (!this.drivers.has(diskName)) {
      const StorageConfig = (global as any).storageConfig;
      const diskConfig = StorageConfig?.disks[diskName];
      if (!diskConfig) throw new Error(`Disk ${diskName} not configured`);
      
      if (diskConfig.driver === "local") {
        this.drivers.set(diskName, new LocalStorageDriver(diskConfig.root, diskConfig.url));
      }
    }
    return this.drivers.get(diskName)!;
  }

  async put(path: string, contents: string | Buffer, options?: StoragePutOptions): Promise<void> {
    return this.disk().put(path, contents, options);
  }

  async get(path: string): Promise<Buffer> {
    return this.disk().get(path);
  }

  async delete(path: string): Promise<void> {
    return this.disk().delete(path);
  }

  async exists(path: string): Promise<boolean> {
    return this.disk().exists(path);
  }

  url(path: string): string {
    return this.disk().url(path);
  }

  async size(path: string): Promise<number> {
    return this.disk().size(path);
  }

  async meta(path: string): Promise<StorageFileMeta> {
    return this.disk().meta(path);
  }

  async copy(from: string, to: string): Promise<void> {
    return this.disk().copy(from, to);
  }

  async move(from: string, to: string): Promise<void> {
    return this.disk().move(from, to);
  }
}

export const Storage = new StorageManager();
