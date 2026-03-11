export function connect() {
  return;
}
export function disconnect() {
  return;
}
export function useChannel(name: string, callback: any) {
  return;
}
export function useChannels(...events: { name: string; callback: any }[]) {
  return;
}

const sockets = {
  connect,
  disconnect,
  useChannel,
  useChannels,
};

export default sockets;
