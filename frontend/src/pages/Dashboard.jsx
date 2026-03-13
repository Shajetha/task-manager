import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/DeleteModal';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, stats, loading, pagination, fetchTasks, fetchStats, createTask, updateTask, deleteTask } = useTasks();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const searchTimerRef = useRef(null);

  const load = useCallback((page = 1, q = search, st = statusFilter) => {
    fetchTasks({ page, search: q, status: st });
    fetchStats();
  }, [fetchTasks, fetchStats, search, statusFilter]);

  useEffect(() => {
    load(currentPage, search, statusFilter);
  }, []); // eslint-disable-line

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setCurrentPage(1);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchTasks({ page: 1, search: val, status: statusFilter });
    }, 400);
  };

  const handleFilter = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    setCurrentPage(1);
    fetchTasks({ page: 1, search, status: val });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTasks({ page, search, status: statusFilter });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreate = async (formData) => {
    setActionLoading(true);
    try {
      await createTask(formData);
      setShowCreateModal(false);
      toast.success('Task created!');
      load(1);
      setCurrentPage(1);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    setActionLoading(true);
    try {
      await updateTask(editTask._id, formData);
      setEditTask(null);
      toast.success('Task updated!');
      load(currentPage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      await updateTask(task._id, { ...task, status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      load(currentPage);
      fetchStats();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteTask(deleteTarget._id);
      setDeleteTarget(null);
      toast.success('Task deleted');
      const newPage = tasks.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      load(newPage);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">✦</div>
          TaskTrack
        </div>
        <div className="nav-user">
          <span className="nav-name">{user?.name}</span>
          <div className="nav-avatar">{initials}</div>
          <button className="btn btn-secondary btn-sm" onClick={() => { logout(); toast('Signed out'); }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-value" style={{ color: 'var(--amber)' }}>{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <select className="filter-select" value={statusFilter} onChange={handleFilter}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowCreateModal(true)}>
            + New Task
          </button>
        </div>

        {/* Task list header */}
        <div className="tasks-header">
          <div className="tasks-count">
            {loading ? 'Loading…' : `${pagination.totalTasks} task${pagination.totalTasks !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Tasks grid */}
        <div className="tasks-grid">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h3>{search || statusFilter ? 'No tasks match your filters' : 'No tasks yet'}</h3>
              <p>{search || statusFilter ? 'Try adjusting your search or filter.' : 'Create your first task to get started!'}</p>
            </div>
          ) : tasks.map((task, i) => (
            <div key={task._id} style={{ animationDelay: `${i * 50}ms` }}>
              <TaskCard
                task={task}
                onEdit={setEditTask}
                onDelete={setDeleteTarget}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      {/* Modals */}
      {showCreateModal && (
        <TaskModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          loading={actionLoading}
        />
      )}
      {editTask && (
        <TaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleEdit}
          loading={actionLoading}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          taskTitle={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
}