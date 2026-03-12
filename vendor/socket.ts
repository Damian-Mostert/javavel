export interface ShouldBroadcast {
  broadcastOn(): string | string[];
  broadcastAs?(): string;
  broadcastWith?(): Record<string, any>;
}

export interface PrivateChannel {
  channel: string;
  users?: string[];
}

export interface PresenceChannel {
  channel: string;
  users: Record<string, any>[];
}

export abstract class Event {
  abstract broadcastOn(): string | string[];
  
  broadcastAs?(): string {
    return this.constructor.name;
  }
  
  broadcastWith?(): Record<string, any> {
    return {};
  }
}

export class ChannelApi {
  private channels: Map<string, any> = new Map();

  channel(name: string, authorizer?: Function) {
    this.channels.set(name, {
      name,
      type: 'channel',
      authorizer: authorizer || (() => true),
    });
    return this;
  }

  private(name: string, authorizer: Function) {
    this.channels.set(`private-${name}`, {
      name,
      type: 'private',
      authorizer,
    });
    return this;
  }

  presence(name: string, authorizer: Function) {
    this.channels.set(`presence-${name}`, {
      name,
      type: 'presence',
      authorizer,
    });
    return this;
  }

  getChannels() {
    return Array.from(this.channels.values());
  }
}

export class Broadcast {
  private io: any;
  private channels: Map<string, Set<string>> = new Map();
  private presenceChannels: Map<string, Map<string, any>> = new Map();
  private channelAuthorizers: Map<string, Function> = new Map();

  constructor(io: any) {
    this.io = io;
  }

  channel(name: string) {
    return {
      broadcast: (event: Event) => this.broadcastToChannel(name, event),
      here: () => this.getChannelUsers(name),
      join: (authorizer: Function | string) => {
        if (typeof authorizer === 'function') {
          this.channelAuthorizers.set(name, authorizer);
        } else {
          this.joinChannel(name, authorizer);
        }
      },
      leave: (userId: string) => this.leaveChannel(name, userId),
    };
  }

  private(name: string) {
    return {
      broadcast: (event: Event) => this.broadcastToPrivateChannel(name, event),
      here: () => this.getChannelUsers(name),
      join: (authorizer: Function) => {
        this.channelAuthorizers.set(`private-${name}`, authorizer);
      },
      leave: (userId: string) => this.leaveChannel(name, userId),
    };
  }

  presence(name: string) {
    return {
      broadcast: (event: Event) => this.broadcastToPresenceChannel(name, event),
      here: () => this.getPresenceChannelUsers(name),
      join: (authorizer: Function) => {
        this.channelAuthorizers.set(`presence-${name}`, authorizer);
      },
      leave: (userId: string) => this.leavePresenceChannel(name, userId),
    };
  }

  registerChannels(channelApi: ChannelApi) {
    channelApi.getChannels().forEach((ch: any) => {
      if (ch.type === 'channel') {
        this.channelAuthorizers.set(ch.name, ch.authorizer);
      } else if (ch.type === 'private') {
        this.channelAuthorizers.set(`private-${ch.name}`, ch.authorizer);
      } else if (ch.type === 'presence') {
        this.channelAuthorizers.set(`presence-${ch.name}`, ch.authorizer);
      }
    });
  }

  async authorize(channelName: string, user: any, params?: any): Promise<boolean> {
    const authorizer = this.channelAuthorizers.get(channelName);
    if (!authorizer) return false;
    
    try {
      const result = await authorizer(user, params);
      return !!result;
    } catch (error) {
      console.error(`Authorization error for channel ${channelName}:`, error);
      return false;
    }
  }

  private broadcastToChannel(channel: string, event: Event) {
    const eventName = event.broadcastAs?.() || event.constructor.name;
    const data = event.broadcastWith?.() || {};
    
    this.io.to(channel).emit(eventName, data);
  }

  private broadcastToPrivateChannel(channel: string, event: Event) {
    const eventName = event.broadcastAs?.() || event.constructor.name;
    const data = event.broadcastWith?.() || {};
    
    this.io.to(`private-${channel}`).emit(eventName, data);
  }

  private broadcastToPresenceChannel(channel: string, event: Event) {
    const eventName = event.broadcastAs?.() || event.constructor.name;
    const data = event.broadcastWith?.() || {};
    
    this.io.to(`presence-${channel}`).emit(eventName, data);
  }

  private joinChannel(channel: string, userId: string) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(userId);
  }

  private leaveChannel(channel: string, userId: string) {
    this.channels.get(channel)?.delete(userId);
  }

  private joinPresenceChannel(channel: string, userId: string, data: any) {
    if (!this.presenceChannels.has(channel)) {
      this.presenceChannels.set(channel, new Map());
    }
    this.presenceChannels.get(channel)!.set(userId, data);
  }

  private leavePresenceChannel(channel: string, userId: string) {
    this.presenceChannels.get(channel)?.delete(userId);
  }

  private getChannelUsers(channel: string): string[] {
    return Array.from(this.channels.get(channel) || []);
  }

  private getPresenceChannelUsers(channel: string): Record<string, any> {
    const users: Record<string, any> = {};
    this.presenceChannels.get(channel)?.forEach((data, userId) => {
      users[userId] = data;
    });
    return users;
  }
}

export const Channel = new ChannelApi();

export default Broadcast;
