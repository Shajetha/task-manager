export default function ConfirmModal({ taskTitle, onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>Delete Task</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="confirm-text">
          Are you sure you want to delete <span className="confirm-name">"{taskTitle}"</span>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading} style={{ width: 'auto' }}>
            {loading ? <><span className="spinner" /> Deleting…</> : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}