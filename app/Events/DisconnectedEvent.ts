import { Event } from "@/vendor/events";

export class DisconnectedEvent extends Event {
  constructor(public userId: string, public name?: string) {
    super();
  }

  broadcastOn(): string {
    return "users";
  }

  broadcastAs(): string {
    return "user.disconnected";
  }

  broadcastWith() {
    return {
      userId: this.userId,
      name: this.name,
      timestamp: new Date(),
    };
  }
}
