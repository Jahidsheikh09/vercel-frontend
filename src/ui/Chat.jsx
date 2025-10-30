import React, { useEffect, useRef, useState } from 'react'

export default function Chat({ socket, username }) {
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typingUser, setTypingUser] = useState('')
  const endRef = useRef(null)
  const typingTimeout = useRef(null)

  useEffect(() => {
    socket.on('chat:history', (history) => setMessages(history))
    socket.on('chat:message', (msg) => setMessages((m) => [...m, msg]))
    socket.on('user:list', (list) => setUsers(list))
    socket.on('chat:typing', ({ username: name, isTyping }) => {
      setTypingUser(isTyping ? name : '')
    })

    return () => {
      socket.off('chat:history')
      socket.off('chat:message')
      socket.off('user:list')
      socket.off('chat:typing')
    }
  }, [socket])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    const content = input.trim()
    if (!content) return
    socket.emit('chat:message', { message: content })
    setInput('')
  }

  function handleTyping(e) {
    setInput(e.target.value)
    socket.emit('chat:typing', true)
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => socket.emit('chat:typing', false), 800)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="me">{username}</div>
        <div className="users-header">Online</div>
        <ul className="users">
          {users.map((u, idx) => (
            <li key={idx} className={u.username === username ? 'self' : ''}>{u.username}</li>
          ))}
        </ul>
      </aside>
      <main className="chat">
        <header className="chat-header">General</header>
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.username === username ? 'mine' : ''}`}>
              <div className="meta">
                <span className="author">{m.username}</span>
                <span className="time">{new Date(m.time).toLocaleTimeString()}</span>
              </div>
              <div className="bubble">{m.message}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {typingUser && typingUser !== username && (
          <div className="typing">{typingUser} is typing…</div>
        )}
        <form className="input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={handleTyping}
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  )
}


