export {};

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
