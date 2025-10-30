const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiGet(path, token) {
  const res = await fetch(`${API_URL}${path}`, { headers: getHeaders(token), credentials: 'include' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Request failed');
  }
  return res.json();
}

export async function apiPost(path, body, token) {
  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(body), credentials: 'include' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Request failed');
  }
  return res.json();
}

export async function apiPut(path, body, token) {
  const res = await fetch(`${API_URL}${path}`, { method: 'PUT', headers: getHeaders(token), body: JSON.stringify(body), credentials: 'include' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Request failed');
  }
  return res.json();
}


