import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalTasks: 0, hasNextPage: false, hasPrevPage: false
  });

  const fetchTasks = useCallback(async ({ page = 1, search = '', status = '', limit = 8 } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data.task;
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
  }, []);

  return { tasks, stats, loading, pagination, fetchTasks, fetchStats, createTask, updateTask, deleteTask };
};