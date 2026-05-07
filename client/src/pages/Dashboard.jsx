import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Loader2, ArrowRight, ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { pageVariants, staggerContainer, itemVariants, cardHoverVariants } from '../utils/animations';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-indigo-400">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  const { stats, recentTasks } = dashboardData || {};

  const getStatusColor = (status) => {
    switch(status) {
      case 'Todo': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'In Progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Done': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Prepare chart data
  const chartData = stats ? [
    { name: 'Completed', value: stats.completedTasks, color: '#34d399' },
    { name: 'In Progress', value: stats.pendingTasks, color: '#fbbf24' },
    { name: 'Overdue', value: stats.overdueTasks, color: '#f87171' },
  ].filter(item => item.value > 0) : [];

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name ? user.name.split(' ')[0] : 'User'}</h1>
          <p className="text-sm text-slate-400 mt-1">Here is the latest snapshot of your team's workflow.</p>
        </div>
        
        {user?.role === 'Admin' && (
          <div className="flex items-center gap-3">
            <Link to="/projects/create" className="px-4 py-2 bg-[#151821] hover:bg-slate-800 text-slate-200 border border-slate-700/50 rounded-lg font-medium transition-colors text-sm shadow-sm">
              New Project
            </Link>
            <Link to="/tasks/create" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all text-sm shadow-lg shadow-indigo-500/20">
              New Task
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {stats && (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} whileHover="hover" custom={cardHoverVariants.hover} className="bg-[#151821] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-sm relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-sm font-medium text-slate-400 mb-2">Total Tasks</p>
            <p className="text-3xl font-bold text-white">{stats.totalTasks}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" custom={cardHoverVariants.hover} className="bg-[#151821] border border-slate-800/80 rounded-xl p-5 hover:border-emerald-500/30 transition-colors shadow-sm relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-400">Completed</p>
              <CheckCircle2 size={16} className="text-emerald-400/50" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.completedTasks}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" custom={cardHoverVariants.hover} className="bg-[#151821] border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/30 transition-colors shadow-sm relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-400">Pending</p>
              <Clock size={16} className="text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendingTasks}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" custom={cardHoverVariants.hover} className={`bg-[#151821] border ${stats.overdueTasks > 0 ? 'border-red-500/30' : 'border-slate-800/80'} rounded-xl p-5 hover:border-red-500/50 transition-colors shadow-sm relative overflow-hidden group cursor-pointer`}>
            {stats.overdueTasks > 0 && <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600"></div>}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-400">Overdue</p>
              <AlertCircle size={16} className={stats.overdueTasks > 0 ? "text-red-400" : "text-slate-600"} />
            </div>
            <p className={`text-3xl font-bold ${stats.overdueTasks > 0 ? 'text-red-400' : 'text-white'}`}>{stats.overdueTasks}</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" custom={cardHoverVariants.hover} className="bg-[#151821] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-sm relative overflow-hidden group col-span-2 lg:col-span-1 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-400">Projects</p>
              <FolderKanban size={16} className="text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
          </motion.div>
        </motion.div>
      )}

      {/* Main Grid: Chart & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="lg:col-span-1 bg-[#151821] border border-slate-800/80 rounded-xl shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800/80">
            <h2 className="text-sm font-semibold text-white">Task Distribution</h2>
          </div>
          <div className="flex-1 p-5 flex flex-col items-center justify-center min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151821', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-slate-700 mx-auto mb-3"></div>
                <p className="text-sm">No task data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="lg:col-span-2 bg-[#151821] border border-slate-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800/80 flex justify-between items-center bg-[#151821]">
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            <Link to="/tasks" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center group">
              View all <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {recentTasks && recentTasks.length > 0 ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#0f1117]/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/80">
                    <th className="px-5 py-3">Task Name</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Priority</th>
                    {user?.role === 'Admin' && <th className="px-5 py-3">Assignee</th>}
                  </tr>
                </thead>
                <motion.tbody 
                  className="divide-y divide-slate-800/80"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {recentTasks.map(task => (
                    <motion.tr variants={itemVariants} key={task._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition-colors truncate max-w-[200px]">{task.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{task.projectId?.projectName || 'No Project'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityColor(task.priority || 'Medium')}`}>
                          {task.priority || 'Medium'}
                        </span>
                      </td>
                      {user?.role === 'Admin' && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center border border-slate-700">
                              {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="text-xs text-slate-400">{task.assignedTo?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-500">
                <ClipboardList size={32} className="mb-3 opacity-20" />
                <p className="text-sm">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
