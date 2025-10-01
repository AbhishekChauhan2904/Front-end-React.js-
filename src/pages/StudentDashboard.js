import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState('');
  const [mine, setMine] = useState(null);

  // Fetch all published assignments
  const fetchAssignments = async () => {
    const res = await axios.get(API_BASE + '/assignments');
    setAssignments(res.data);
  };

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    fetchAssignments();
  }, []);

  // View assignment details
  const viewAssignment = async (id) => {
    const res = await axios.get(`${API_BASE}/assignments/${id}`);
    setSelected(res.data.assignment);

    const submission = await axios.get(`${API_BASE}/submissions/mine/${id}`);
    setMine(submission.data);
    setAnswer(submission.data?.answer || '');
  };

  // Submit answer (only if not submitted yet)
  const submitAnswer = async () => {
    if (mine) return;
    if (!answer.trim()) {
      alert('Please write an answer before submitting.');
      return;
    }

    await axios.post(`${API_BASE}/submissions/${selected._id}`, { answer });

    const submission = await axios.get(`${API_BASE}/submissions/mine/${selected._id}`);
    setMine(submission.data);
  };

  return (
    <div
      style={{
        backgroundColor: '#e0e0e0', // grey background
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2>Student Dashboard</h2>
          <div>
            <strong>{user.name}</strong>{' '}
            <button
              className="btn"
              onClick={logout}
              style={{
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Assignment List */}
        <div className="card" style={{ padding: '20px', borderRadius: '5px', backgroundColor: 'white', marginBottom: '20px' }}>
          <h3>Published Assignments</h3>
          {assignments.map((a) => (
            <div
              key={a._id}
              className="card"
              style={{ marginBottom: 12, padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{a.title}</h4>
                  <div>{a.description}</div>
                  <div>Due: {a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 10) : '—'}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <button
                    className="btn"
                    onClick={() => viewAssignment(a._id)}
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    View & Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assignment Details & Submission */}
        {selected && (
          <div className="card" style={{ padding: '20px', borderRadius: '5px', backgroundColor: 'white' }}>
            <h3>{selected.title}</h3>
            <div>{selected.description}</div>
            <div>Due: {selected.dueDate ? new Date(selected.dueDate).toISOString().slice(0, 10) : '—'}</div>

            {mine ? (
              <div style={{ marginTop: 12 }}>
                <h4>Your Submission (read-only)</h4>
                <textarea
                  value={mine.answer}
                  readOnly
                  style={{ width: '100%', height: '100px', backgroundColor: '#f0f0f0', padding: '8px' }}
                />
                <div>Submitted at: {new Date(mine.submittedAt).toLocaleString()}</div>
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your answer"
                  style={{ width: '100%', height: '100px', marginBottom: 8, padding: '8px' }}
                />
                <button
                  className="btn"
                  onClick={submitAnswer}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Submit (one-time)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
