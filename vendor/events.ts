import Redis from 'ioredis';
import BroadcastingConfig from '@/config/broadcasting';

export interface ShouldBroadcast {
  broadcastOn(): string | string[];
  broadcastAs?(): string;
  broadcastWith?(): Record<string, any>;
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

export class EventDispatcher {
  private redis: Redis;
  private pubRedis: Redis;
  private io: any;
  private listeners: Map<string, Function[]> = new Map();
  private subscribedChannels: Set<string> = new Set();

  constructor(io: any, redisUrl?: string) {
    this.io = io;
    this.redis = new Redis(redisUrl || 'redis://localhost:6379');
    this.pubRedis = new Redis(redisUrl || 'redis://localhost:6379');
    
    console.log(`[EventDispatcher] Connecting to Redis at ${redisUrl}`);
    
    // Subscribe to Redis events
    this.redis.on('message', (channel: string, message: string) => {
      console.log(`[EventDispatcher] Redis message received on channel "${channel}"`);
      try {
        const data = JSON.parse(message);
        console.log(`[EventDispatcher] Broadcasting to clients on channel "${channel}":`, data.event);
        this.broadcastToClients(channel, data);
      } catch (error) {
        console.error('[EventDispatcher] Error parsing Redis message:', error);
      }
    });

    this.redis.on('error', (error) => {
      console.error('[EventDispatcher] Redis error:', error);
    });
  }

  dispatch(event: Event): void {
    const channels = Array.isArray(event.broadcastOn()) 
      ? event.broadcastOn() 
      : [event.broadcastOn()];
    
    const eventName = event.broadcastAs?.() || event.constructor.name;
    const data = event.broadcastWith?.() || {};

    console.log(`[EventDispatcher] Dispatching event "${eventName}" to channels:`, channels);

    channels.forEach((channel) => {
      // Validate event against broadcasting config
      const channelConfig = BroadcastingConfig.channels[channel as keyof typeof BroadcastingConfig.channels];
      if (!channelConfig) {
        console.warn(`[EventDispatcher] Channel "${channel}" not defined in broadcasting config`);
        return;
      }

      const message = {
        event: eventName,
        data,
        timestamp: new Date().toISOString(),
      };

      console.log(`[EventDispatcher] Publishing to Redis channel "${channel}"`);
      // Publish to Redis
      this.pubRedis.publish(channel, JSON.stringify(message));

      console.log(`[EventDispatcher] Broadcasting via Socket.IO to channel "${channel}"`);
      // Broadcast via Socket.IO (handle both server and client)
      if (this.io.to && typeof this.io.to === 'function') {
        // Server-side Socket.IO
        this.io.to(channel).emit(eventName, message);
      } else if (this.io.emit && typeof this.io.emit === 'function') {
        // Client-side Socket.IO
        this.io.emit(eventName, message);
      }
    });

    // Call local listeners
    channels.forEach((channel) => {
      const handlers = this.listeners.get(channel) || [];
      handlers.forEach((handler) => {
        handler({ event: eventName, data });
      });
    });
  }

  listen(channel: string, callback: (event: any) => void): void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
      this.subscribeToChannel(channel);
    }
    this.listeners.get(channel)!.push(callback);
  }

  private subscribeToChannel(channel: string): void {
    if (!this.subscribedChannels.has(channel)) {
      this.subscribedChannels.add(channel);
      console.log(`[EventDispatcher] Subscribing to Redis channel "${channel}"`);
      this.redis.subscribe(channel, (err) => {
        if (err) {
          console.error(`[EventDispatcher] Failed to subscribe to channel ${channel}:`, err);
        } else {
          console.log(`[EventDispatcher] Successfully subscribed to channel "${channel}"`);
        }
      });
    }
  }

  private broadcastToClients(channel: string, message: any): void {
    this.io.to(channel).emit(message.event, message);
  }

  async getChannelHistory(channel: string, limit: number = 50): Promise<any[]> {
    const key = `channel:${channel}:history`;
    const messages = await this.redis.lrange(key, -limit, -1);
    return messages.map((msg) => JSON.parse(msg));
  }

  async clearChannelHistory(channel: string): Promise<void> {
    const key = `channel:${channel}:history`;
    await this.redis.del(key);
  }
}

export default EventDispatcher;
