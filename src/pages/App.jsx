import React, { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'
import AuthPage from '../ui/AuthPage.jsx'
import ChatApp from '../ui/ChatApp.jsx'

const WS_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

function Inner() {
  const { isAuthed, token, loading } = useAuth()
  const socket = useMemo(() => {
    if (!token) return null
    return io(WS_URL, { withCredentials: true, auth: { token } })
  }, [token])

  useEffect(() => {
    if (socket) {
      return () => socket.disconnect()
    }
  }, [socket])

  if (loading) {
    return (
      <div className="centered">
        <div className="card">
          <h1>Loading...</h1>
          <p>Please wait while we load your data.</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return <AuthPage />
  return <ChatApp socket={socket} />
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  )
}


