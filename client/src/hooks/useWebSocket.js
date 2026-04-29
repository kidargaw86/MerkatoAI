import { useEffect } from "react";

export default function useWebSocket(url) {
  useEffect(() => {
    if (!url) return;
    const socket = new WebSocket(url);
    return () => socket.close();
  }, [url]);
}
