import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Navbar from './Navbar';
import { API_BASE_URL } from '../config/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalFiles: 0,
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      alert('Error fetching stats');
      navigate('/admin-login');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully');
      fetchStats();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleToggleAdmin = async (userId) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Admin status updated');
      fetchStats();
    } catch (err) {
      alert('Error updating admin status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    let next = stats.users.filter((user) => {
      const matchesQuery = !term
        || String(user.name || '').toLowerCase().includes(term)
        || String(user.email || '').toLowerCase().includes(term);

      const matchesRole = roleFilter === 'all'
        || (roleFilter === 'admin' && user.isAdmin)
        || (roleFilter === 'user' && !user.isAdmin);

      return matchesQuery && matchesRole;
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    next = [...next].sort((a, b) => {
      if (sortKey === 'name') {
        return dir * String(a.name || '').localeCompare(String(b.name || ''));
      }
      if (sortKey === 'fileCount') {
        return dir * ((a.fileCount || 0) - (b.fileCount || 0));
      }
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return dir * (aDate - bDate);
    });

    return next;
  }, [query, roleFilter, sortKey, sortDir, stats.users]);

  const handleExportCsv = () => {
    const rows = filteredUsers.map((user) => ({
      name: user.name || '',
      email: user.email || '',
      role: user.isAdmin ? 'Admin' : 'User',
      files: user.fileCount || 0,
      joined: user.createdAt ? new Date(user.createdAt).toISOString() : '',
    }));

    const header = ['name', 'email', 'role', 'files', 'joined'];
    const body = rows.map((row) =>
      header.map((key) => `"${String(row[key]).replace(/"/g, '""')}"`).join(',')
    );

    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-container">
      <Navbar />
      
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Operations</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Monitor users, manage access, and keep the platform clean.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchStats} className="refresh-btn">
            Refresh
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Admins</h3>
          <p className="stat-number">{stats.totalAdmins}</p>
        </div>
        <div className="stat-card">
          <h3>Total Files</h3>
          <p className="stat-number">{stats.totalFiles}</p>
        </div>
        <div className="stat-card subtle">
          <h3>Visible Users</h3>
          <p className="stat-number">{filteredUsers.length}</p>
          <p className="stat-caption">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Not synced yet'}
          </p>
        </div>
      </div>

      <div className="users-section">
        <div className="users-header">
          <div>
            <h2>All Users</h2>
            <p className="users-subtitle">Search, filter, and manage access in one place.</p>
          </div>
          <div className="users-actions">
            <button onClick={handleExportCsv} className="export-btn">
              Export CSV
            </button>
          </div>
        </div>

        <div className="users-controls">
          <div className="search-field">
            <input
              type="text"
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>
              Role
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
            </label>
            <label>
              Sort
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="createdAt">Joined Date</option>
                <option value="name">Name</option>
                <option value="fileCount">File Count</option>
              </select>
            </label>
            <button
              type="button"
              className="sort-dir"
              onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            >
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Files</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.fileCount}</td>
                <td>
                  <span className={`status-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => handleToggleAdmin(user.id)}
                    className={`toggle-btn ${user.isAdmin ? 'revoke' : 'grant'}`}
                  >
                    {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No users match your filters.</p>
            <button className="reset-btn" onClick={() => { setQuery(''); setRoleFilter('all'); }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
