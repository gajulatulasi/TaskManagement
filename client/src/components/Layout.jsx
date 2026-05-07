import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ClipboardList, 
  Users, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sidebarVariants } from '../utils/animations';
import bgImage from '../assets/login_bg.png';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200 flex font-sans selection:bg-indigo-500/30 relative">
      
      {/* Animated Background Image */}
      <motion.div 
        className="fixed inset-0 z-0 opacity-[0.15] mix-blend-screen pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Accent Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#151821]/95 backdrop-blur-md border-r border-slate-800/60

        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Ethara</span>
          
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="p-6">
          <div className="flex items-center space-x-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <link.icon 
                size={18} 
                className={`mr-3 transition-colors ${
                  window.location.pathname.startsWith(link.path) ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} 
              />
              {link.name}
            </NavLink>
          ))}
          
          {user?.role === 'Admin' && (
            <>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8 px-2">Admin</div>
              <NavLink
                to="/team"
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
              >
                <Users size={18} className="mr-3 text-slate-500 group-hover:text-slate-300" />
                Team Directory
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut size={18} className="mr-3 text-slate-500 group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0f1117]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-30">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden mr-4 text-slate-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0f1117]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer shadow-sm shadow-indigo-500/20 ring-2 ring-slate-800 hover:ring-indigo-500/50 transition-all">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Main Content scrollable area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;
