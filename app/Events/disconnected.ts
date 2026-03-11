import { Event } from "@/vendor/socket";

export class DisconnectedEvent extends Event {
  name = "disconnected";
}
