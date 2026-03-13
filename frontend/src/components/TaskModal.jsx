import { useState, useEffect } from 'react';

export default function TaskModal({ task, onClose, onSave, loading }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [error, setError] = useState('');
  const isEdit = !!task;

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description || '', status: task.status });
  }, [task]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters.');
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Task' : 'New Task'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              placeholder="Add more details (optional)"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-input" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto' }}>
              {loading ? <><span className="spinner" /> Saving…</> : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}