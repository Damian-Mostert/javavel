import { Command } from "./commands";
import { Controller, Middleware } from "./http";

export type HttpKernel = {
  middleware: Middleware[];
  middlewareGroups: {
    [key: string]: Middleware[];
  };
  routeMiddleware: {
    [key: string]: Middleware;
  };
  controllers: {
    [key: string]: Controller;
  };
};

export type CommandKernel = {
  commands: {
    [key: string]: Command;
  };
  schedule(Schedule: any): void;
};
