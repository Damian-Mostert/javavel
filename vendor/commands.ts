export type Command = {
  aliases?: string[];
  description?: string;
  handler: (
    args: string[],
    commands: { [key: string]: Command },
  ) => Promise<any> | any;
  [key: string]: any;
};
