import { Event } from "@/vendor/events";

export class TestBroadcastEvent extends Event {
  constructor(public message: string, public type: string = "info") {
    super();
  }

  broadcastOn(): string {
    return "users";
  }

  broadcastAs(): string {
    return "test.broadcast";
  }

  broadcastWith() {
    return {
      message: this.message,
      type: this.type,
      timestamp: new Date(),
    };
  }
}
