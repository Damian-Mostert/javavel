export {};

export abstract class Job {
  abstract handle(...args: any[]): Promise<void>;
  //@ts-ignore
  dispatch(...args: any[]): Promise<void>;
}
