import React, { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(window.location.origin, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

export function useChannel(channelName: string, callback: (data: any) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const sock = getSocket();

    const handleMessage = (data: any) => {
      callbackRef.current(data);
    };

    sock.on(channelName, handleMessage);

    return () => {
      sock.off(channelName, handleMessage);
    };
  }, [channelName]);
}

export function useChannels(...events: { name: string; callback: (data: any) => void }[]) {
  const eventsRef = useRef(events);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const sock = getSocket();
    const handlers: Record<string, Function> = {};

    eventsRef.current.forEach(({ name, callback }) => {
      const handler = (data: any) => callback(data);
      handlers[name] = handler;
      sock.on(name, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([name, handler]) => {
        sock.off(name, handler as any);
      });
    };
  }, []);
}

export function usePresence(channelName: string) {
  const [users, setUsers] = React.useState<Record<string, any>>({});

  useEffect(() => {
    const sock = getSocket();

    sock.on(`presence-${channelName}:here`, (data: any) => {
      setUsers(data);
    });

    sock.on(`presence-${channelName}:joining`, (data: any) => {
      setUsers((prev) => ({ ...prev, [data.id]: data }));
    });

    sock.on(`presence-${channelName}:leaving`, (data: any) => {
      setUsers((prev) => {
        const updated = { ...prev };
        delete updated[data.id];
        return updated;
      });
    });

    return () => {
      sock.off(`presence-${channelName}:here`);
      sock.off(`presence-${channelName}:joining`);
      sock.off(`presence-${channelName}:leaving`);
    };
  }, [channelName]);

  return users;
}

export function usePrivateChannel(channelName: string, callback: (data: any) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const sock = getSocket();

    const handleMessage = (data: any) => {
      callbackRef.current(data);
    };

    sock.on(`private-${channelName}`, handleMessage);

    return () => {
      sock.off(`private-${channelName}`, handleMessage);
    };
  }, [channelName]);
}

export function emit(channel: string, event: string, data: any) {
  const sock = getSocket();
  sock.emit(event, { channel, data });
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

const sockets = {
  useChannel,
  useChannels,
  usePresence,
  usePrivateChannel,
  emit,
  disconnect,
  getSocket,
};

export default sockets;
