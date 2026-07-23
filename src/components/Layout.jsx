import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LogOut, Package, Search, Menu, X } from 'lucide-react';

export const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/login';
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">KP Hardware</h2>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a href="/products" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-primary font-medium rounded-lg">
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
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>
          <div className="font-bold text-gray-900">KP Hardware</div>
        </div>
        
        <div className="p-4 md:p-8 flex-1 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
