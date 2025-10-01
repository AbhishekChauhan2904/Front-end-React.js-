import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#e0e0e0', // grey background
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          padding: '20px',
          borderRadius: '5px',
          width: '400px',
          backgroundColor: 'white',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={submit}>
          <label>Email-id</label>
          <input
            style={{ marginTop: '5px', marginBottom: '10px', width: '100%', padding: '8px' }}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            style={{ marginTop: '5px', marginBottom: '10px', width: '100%', padding: '8px' }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              className="btn"
              style={{
                width: '48%',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                height: '40px',
              }}
              type="submit"
            >
              Login
            </button>

            <Link to="/register" style={{ width: '48%' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  backgroundColor: 'grey',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  height: '40px',
                }}
                className="btn"
              >
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
