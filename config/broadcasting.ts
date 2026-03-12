const BroadcastingConfig = {
  channels: {
    users: {
      events: {
        connected: "user.connected",
        disconnected: "user.disconnected",
        testBroadcast: "test.broadcast",
      },
    },
    notifications: {
      events: {
        sent: "notification.sent",
      },
    },
    chat: {
      events: {
        message: "chat.message",
        userJoined: "chat.user.joined",
        userLeft: "chat.user.left",
      },
    },
  },
};

export default BroadcastingConfig;
