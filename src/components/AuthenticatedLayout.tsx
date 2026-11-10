import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AuthenticatedLayout.css';

export default function AuthenticatedLayout() {
  const navigate = useNavigate();

  // Block access if the user is not authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-layout">
      <aside className="auth-sidebar">
        <div className="sidebar-header">
          <h2>ExpenseTracker</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/expenses" className="nav-link">
            Expenses
          </Link>

          <Link to="/expenses/new" className="nav-link">
            Add Expense
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            User Placeholder
          </div>

          <button
            type="button"
            className="nav-link logout-link"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
