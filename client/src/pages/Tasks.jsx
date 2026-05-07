import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { pageVariants, staggerContainer, itemVariants } from '../utils/animations';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const currentUser = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

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

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-indigo-400">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <ClipboardList className="mr-3 text-indigo-400" size={24} />
            Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and update task statuses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            className="bg-[#151821] border border-slate-700/50 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {currentUser?.role === 'Admin' && (
            <Link
              to="/tasks/create"
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              <Plus size={16} className="mr-1.5" />
              New Task
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#151821] border border-slate-800/80 rounded-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
            <ClipboardList size={32} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No tasks assigned</h3>
          <p className="text-sm text-slate-400 max-w-sm text-center mb-6">
            {currentUser?.role === 'Admin' 
              ? "Create a task to get your team started." 
              : "You have a clear plate! No tasks are currently assigned to you."}
          </p>
          {currentUser?.role === 'Admin' && (
            <Link
              to="/tasks/create"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Create First Task
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-[#151821] border border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#0f1117]/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/80">
                  <th className="px-6 py-4">Task Details</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Due Date</th>
                  {currentUser?.role === 'Admin' && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-slate-800/80"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {tasks
                  .filter(task => statusFilter === 'All' || task.status === statusFilter)
                  .map((task) => (
                  <motion.tr variants={itemVariants} key={task._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">{task.title}</div>
                      {currentUser?.role === 'Admin' && (
                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300 flex items-center justify-center border border-slate-700 mr-1.5">
                            {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          {task.assignedTo?.name || 'Unassigned'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-400">{task.projectId?.projectName || 'No Project'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select 
                          className={`appearance-none bg-transparent border py-1 pl-3 pr-8 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${getStatusColor(task.status)}`}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                          <option value="Todo" className="bg-[#151821] text-slate-300">Todo</option>
                          <option value="In Progress" className="bg-[#151821] text-amber-400">In Progress</option>
                          <option value="Done" className="bg-[#151821] text-emerald-400">Done</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityColor(task.priority || 'Medium')}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-400 font-medium' : 'text-slate-400'}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    {currentUser?.role === 'Admin' && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;
