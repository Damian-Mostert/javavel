export function useChannel(name: string, callback: any) {
  return;
}
export function useChannels(...events: { name: string; callback: any }[]) {
  return;
}

function emit(channel: string, event: string, data: any) {}

const sockets = {
  useChannel,
  useChannels,
  emit,
};

export default sockets;
