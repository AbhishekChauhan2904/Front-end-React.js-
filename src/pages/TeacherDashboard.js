import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const fetch = async () => {
    const res = await axios.get(API_BASE + '/assignments' + (filter ? ('?status=' + filter) : ''));
    setAssignments(res.data);
  };

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    fetch();
  }, []);

  const create = async () => {
    await axios.post(API_BASE + '/assignments', { title, description: desc, dueDate: due || null });
    setTitle('');
    setDesc('');
    setDue('');
    fetch();
  };

  const publish = async (id) => {
    await axios.put(API_BASE + '/assignments/' + id, { status: 'Published' });
    fetch();
  };

  const complete = async (id) => {
    await axios.put(API_BASE + '/assignments/' + id, { status: 'Completed' });
    fetch();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete?')) return;
    await axios.delete(API_BASE + '/assignments/' + id);
    fetch();
  };

  const view = async (id) => {
    const res = await axios.get(API_BASE + '/assignments/' + id);
    setSelected(res.data.assignment);
    setSubmissions(res.data.submissions || []);
  };

  const markReviewed = async (sid) => {
    await axios.put(API_BASE + '/submissions/' + sid + '/review');
    view(selected._id);
  };

  return (
    <div
      style={{
        backgroundColor: '#e0e0e0',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Teacher Dashboard</h2>
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

        {/* Create Assignment */}
        <div className="card" style={{ padding: '20px', borderRadius: '5px', backgroundColor: 'white', marginBottom: '20px' }}>
          <h3>Create Assignment</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', minHeight: '80px' }}
          />
          <input
            type="date"
            value={due}
            onChange={e => setDue(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          <button
            className="btn"
            onClick={create}
            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '2px', padding: '8px 12px', cursor: 'pointer' }}
          >
            Create (Draft)
          </button>
        </div>

        {/* Assignment List */}
        <div className="card" style={{ padding: '20px', borderRadius: '5px', backgroundColor: 'white', marginBottom: '20px' }}>
          <h3>Your Assignments</h3>
          <div style={{ marginBottom: 8 }}>
            Filter:{' '}
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '4px' }}>
              <option value="">All</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Completed</option>
            </select>
            <button
              className="btn"
              onClick={fetch}
              style={{ marginLeft: 8, backgroundColor: 'grey', color: 'white', border: 'none', borderRadius: '2px', padding: '6px 12px', cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>
          {assignments.map(a => (
            <div key={a._id} className="card" style={{ padding: '10px', marginBottom: '12px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4>{a.title} <small>({a.status})</small></h4>
                  <div>Due: {a.dueDate ? dayjs(a.dueDate).format('YYYY-MM-DD') : '—'}</div>
                  <div>{a.description}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
                  {a.status === 'Draft' && (
                    <button
                      className="btn"
                      onClick={() => publish(a._id)}
                      style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '2px', padding: '6px', cursor: 'pointer' }}
                    >
                      Publish
                    </button>
                  )}
                  {a.status !== 'Completed' && (
                    <button
                      className="btn"
                      onClick={() => complete(a._id)}
                      style={{ backgroundColor: 'grey', color: 'white', border: 'none', borderRadius: '2px', padding: '6px', cursor: 'pointer' }}
                    >
                      Mark Completed
                    </button>
                  )}
                  {a.status === 'Draft' && (
                    <button
                      className="btn"
                      onClick={() => remove(a._id)}
                      style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '2px', padding: '6px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn"
                    onClick={() => view(a._id)}
                    style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '2px', padding: '6px', cursor: 'pointer' }}
                  >
                    View Submissions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submissions */}
        {selected && (
          <div className="card" style={{ padding: '20px', borderRadius: '5px', backgroundColor: 'white' }}>
            <h3>Submissions for: {selected.title}</h3>
            {submissions.length === 0 && <div>No submissions yet</div>}
            {submissions.map(s => (
              <div key={s._id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
                <div><strong>{s.student.name}</strong></div>
                <div>Submitted: {dayjs(s.submittedAt).format('YYYY-MM-DD HH:mm')}</div>
                <div>{s.answer}</div>
                <div>Status: {s.reviewed ? 'Reviewed' : 'Pending'}</div>
                {!s.reviewed && (
                  <button
                    className="btn"
                    onClick={() => markReviewed(s._id)}
                    style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '2px', padding: '6px', marginTop: '6px', cursor: 'pointer' }}
                  >
                    Mark Reviewed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
