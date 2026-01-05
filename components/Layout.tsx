
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  isDemoMode: boolean;
  onToggleMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, isDemoMode, onToggleMode }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: '儀表板', icon: 'fa-chart-pie' },
    { path: '/accounts', label: '銀行帳戶', icon: 'fa-university' },
    { path: '/transactions', label: '收支明細', icon: 'fa-list-ul' },
    { path: '/analysis', label: 'AI 分析報表', icon: 'fa-magic' },
    { path: '/settings', label: '分類管理', icon: 'fa-tags' },
  ];

  const activeClass = "bg-indigo-600 text-white";
  const inactiveClass = "text-slate-600 hover:bg-slate-100";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fas fa-coins"></i>
            </div>
            <span className="text-xl font-bold text-slate-800">SmartFinance</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? activeClass : inactiveClass}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
             <div className="flex items-center justify-between p-2 mb-4 rounded-lg bg-amber-50 text-amber-800 text-sm">
                <span>{isDemoMode ? '展示模式' : '正式模式'}</span>
                <button 
                  onClick={onToggleMode}
                  className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs font-bold transition-colors"
                >
                  切換
                </button>
             </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 uppercase">
                {user?.email?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                <button onClick={onLogout} className="text-xs text-red-500 hover:underline">登出</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <span className="text-lg font-bold text-slate-800">SmartFinance</span>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
