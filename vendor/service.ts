export {};

export abstract class Service {
  abstract handler(...args: any[]): Promise<void>;
}
