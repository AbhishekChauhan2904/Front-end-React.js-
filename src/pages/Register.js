import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ name, email, password, role });
      if (data.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#e0e0e0', // light grey
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div className="card" style={{ padding: '20px', borderRadius: '5px', width: '400px', backgroundColor: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        <form onSubmit={submit}>
          <label>Name</label>
          <input
            style={{ marginTop: '5px', marginBottom: '10px', width: '100%', padding: '8px' }}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <label>Student</label>
            <input
              style={{ marginLeft: '10px' }}
              type="radio"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <label>Teacher</label>
            <input
              style={{ marginLeft: '10px' }}
              type="radio"
              checked={role === 'teacher'}
              onChange={() => setRole('teacher')}
            />
          </div>

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button
              className="btn"
              style={{
                width: '200px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                height: '40px',
              }}
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
