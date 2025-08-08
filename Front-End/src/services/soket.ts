import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL,{ //env
  withCredentials: true,  
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000    // fail connection after 10s if no response
});
// console.log(socket)

socket.on("connect_error", (err) => {
  console.error("Socket connect error:", err.message, err); 
  toast.error(err.message);  
});

// Show reconnect attempt
socket.on("reconnect_attempt", (attemptNumber) => {
  toast.info(`Reconnecting... (Attempt ${attemptNumber} of 5)`, { autoClose: 2000 });
});

// Reconnection success
socket.on("reconnect", (attemptNumber) => {
  toast.success("Reconnected successfully after " + attemptNumber + " attempt(s).", { autoClose: 3000 });
});

// Final failure after max attempts
socket.on("reconnect_failed", () => {
  toast.error("Failed to reconnect after multiple attempts.");
});

export default socket;
