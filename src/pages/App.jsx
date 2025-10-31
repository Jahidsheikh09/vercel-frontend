import React, { useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";
import AuthPage from "../ui/AuthPage.jsx";
import ChatApp from "../ui/ChatApp.jsx";

const WS_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";

function Inner() {
  const { isAuthed, token, loading } = useAuth();
  const socketRef = useRef(null);
  
  const socket = useMemo(() => {
    if (!token) {
      // If token is removed, disconnect existing socket
      if (socketRef.current) {
        console.log("[Socket] Token removed, disconnecting existing socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return null;
    }
    
    // If socket already exists and token is the same, reuse it
    if (socketRef.current) {
      console.log("[Socket] Reusing existing socket instance");
      return socketRef.current;
    }
    
    console.log("[Socket] Creating new socket instance with token");
    const socketInstance = io(WS_URL, { 
      withCredentials: true, 
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
    });
    
    socketRef.current = socketInstance;
    
    // Set up event listeners only once
    socketInstance.on("connect", () => {
      console.log("[Socket] Connected successfully", socketInstance.id);
    });
    
    socketInstance.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message || error);
      if (error.message?.includes("Unauthorized")) {
        console.error("[Socket] Authentication failed - invalid token");
      }
    });
    
    socketInstance.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected the socket, need to manually reconnect
        console.log("[Socket] Server disconnected, attempting reconnect...");
        socketInstance.connect();
      }
    });
    
    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("[Socket] Reconnected after", attemptNumber, "attempts");
    });
    
    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log("[Socket] Reconnection attempt", attemptNumber);
    });
    
    socketInstance.on("reconnect_error", (error) => {
      console.error("[Socket] Reconnection error:", error);
    });
    
    socketInstance.on("reconnect_failed", () => {
      console.error("[Socket] Reconnection failed after all attempts");
    });
    
    return socketInstance;
  }, [token]);

  // Clean up socket only on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("[Socket] Component unmounting, cleaning up socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty deps - only run on unmount

  if (loading) {
    return (
      <div className="centered">
        <div className="card">
          <h1>Loading...</h1>
          <p>Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return <AuthPage />;
  return <ChatApp socket={socket} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
