import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', username: '', name: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      if (mode === 'login') await login({ email: form.email, password: form.password })
      else await register(form)
    } catch (e) {
      setError('Failed. Check details and try again.')
    }
  }

  return (
    <div className="centered">
      <form className="card" onSubmit={handleSubmit}>
        <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
        {mode === 'register' && (
          <>
            <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Name (optional)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </>
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <div style={{ color: '#f66' }}>{error}</div>}
        <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ background: 'transparent', color: 'var(--subtext)' }}>
          {mode === 'login' ? 'Create an account' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  )
}


