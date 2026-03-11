export {};

export interface ShouldQueue {
  queue?: string;
  connection?: string;
  delay?: number;
  tries?: number;
  timeout?: number;
  backoff?: number;
}

export abstract class Job implements ShouldQueue {
  queue?: string;
  connection?: string;
  delay?: number;
  tries?: number = 3;
  timeout?: number = 60;
  backoff?: number = 0;

  constructor() {}

  abstract handle(): Promise<void>;

  static dispatch<T extends Job>(this: new () => T): Promise<void> {
    const job = new this();
    return job.handle();
  }

  static dispatchSync<T extends Job>(this: new () => T): Promise<void> {
    return this.dispatch();
  }

  static dispatchAfter<T extends Job>(this: new () => T, delay: number): Promise<void> {
    const job = new this();
    job.delay = delay;
    return new Promise((resolve) => {
      setTimeout(() => {
        job.handle().then(resolve);
      }, delay);
    });
  }

  onQueue(queue: string): this {
    this.queue = queue;
    return this;
  }

  onConnection(connection: string): this {
    this.connection = connection;
    return this;
  }

  withDelay(delay: number): this {
    this.delay = delay;
    return this;
  }

  failed(error: Error): void {
    console.error('Job failed:', error);
  }
}
