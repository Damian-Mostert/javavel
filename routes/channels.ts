import { Channel } from "@/vendor/socket";

Channel.channel("users");
Channel.channel("notifications");

Channel.private("user.{id}", (user: any, id: string) => user.id === parseInt(id));
Channel.private("chat.{roomId}", (user: any, roomId: string) => true);

Channel.presence("online-users", (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
}));

Channel.presence("chat.{roomId}", (user: any, roomId: string) => ({
  id: user.id,
  name: user.name,
}));

export default Channel;
