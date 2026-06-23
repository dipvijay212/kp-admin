import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LogOut, Package, Search } from 'lucide-react';

export const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Package className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">KP Hardware</h2>
            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a href="/products" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-primary font-medium rounded-lg">
                <Package size={18} /> Products
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
