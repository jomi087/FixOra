import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL,{ //env
  withCredentials: true,  
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,    // fail connection after 10s if no response
  autoConnect: false,  // socket doesn't auto-connect on import.
});

export default socket;

/* 
  By default autoConnect is true 
  Reason for turning it off : If we allow  defualt autoConnect, the socket will try to connect immediately when the app starts,
  even before the user's auth token is set or available (which causes the connection to fail).
  By setting autoConnect to false, we manually connect only after user info is ready.(hence connecty manuly in socketwrapper)
*/