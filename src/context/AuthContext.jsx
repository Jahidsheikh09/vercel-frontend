import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost, apiPut } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAuthed = !!token && !!user

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    apiGet('/api/users/me', token).then((userData) => {
      setUser(userData)
      setLoading(false)
    }).catch((error) => {
      console.error('Auth error:', error)
      setToken('')
      setUser(null)
      setLoading(false)
    })
  }, [token])

  async function register(data) {
    const res = await apiPost('/api/users/register', data)
    setToken(res.token)
    setUser(res.user)
  }

  async function login(data) {
    const res = await apiPost('/api/users/login', data)
    setToken(res.token)
    setUser(res.user)
  }

  function logout() {
    setToken('')
    setUser(null)
  }

  async function updateProfile(data) {
    const updated = await apiPut('/api/users/me', data, token)
    setUser(updated)
    return updated
  }

  const value = useMemo(() => ({ token, user, isAuthed, loading, register, login, logout, updateProfile }), [token, user, isAuthed, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }


