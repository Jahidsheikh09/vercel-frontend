import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onLogin(name.trim())
  }

  return (
    <div className="centered">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Welcome</h1>
        <p>Enter a display name to join chat</p>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}


