import { MdModeEditOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { MdOutlinePendingActions } from "react-icons/md";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus, loading }) {
  const isCompleted = task.status === 'completed';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className={`task-title ${isCompleted ? 'completed' : ''}`}>{task.title}</h3>
        <div className="task-actions">
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onToggleStatus(task)}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            disabled={loading}
          >
            {isCompleted ? <MdOutlinePendingActions /> : <TiTick />}
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <MdModeEditOutline />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onDelete(task)}
            title="Delete task"
            style={{ color: 'var(--red)' }}
          >
           <AiFillDelete />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <span className={`badge badge-${task.status}`}>
         {task.status}
        </span>
        <span className="task-date">{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
}