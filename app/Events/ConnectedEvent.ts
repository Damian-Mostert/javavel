import { Event } from "@/vendor/events";

export class ConnectedEvent extends Event {
  constructor(public userId: string, public name?: string, public email?: string) {
    super();
  }

  broadcastOn(): string {
    return "users";
  }

  broadcastAs(): string {
    return "user.connected";
  }

  broadcastWith() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      timestamp: new Date(),
    };
  }
}
