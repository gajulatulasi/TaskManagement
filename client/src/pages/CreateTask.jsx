import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PlusSquare, ArrowLeft, Loader2, Type, AlignLeft, Calendar, ShieldAlert } from 'lucide-react';
import { pageVariants, buttonVariants } from '../utils/animations';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });
  
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, usersRes] = await Promise.all([
          axios.get('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProjects(projRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Failed to load form data');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-indigo-400">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/tasks" className="mr-4 p-2 bg-[#151821] hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            Create Task
          </h1>
          <p className="text-sm text-slate-400 mt-1">Assign actionable items to your team members.</p>
        </div>
      </div>

      <div className="bg-[#151821] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Task Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Type size={18} />
              </div>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-600 outline-none"
                placeholder="e.g. Design Homepage UI"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Select Project</label>
              <select
                name="projectId"
                required
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 appearance-none outline-none"
              >
                <option value="" className="bg-[#151821] text-slate-500">Choose project...</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id} className="bg-[#151821]">{p.projectName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Assign To</label>
              <select
                name="assignedTo"
                required
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 appearance-none outline-none"
              >
                <option value="" className="bg-[#151821] text-slate-500">Choose team member...</option>
                {users.map(u => (
                  <option key={u._id} value={u._id} className="bg-[#151821]">{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Due Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Priority</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <ShieldAlert size={18} />
                </div>
                <select
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 appearance-none outline-none"
                >
                  <option value="Low" className="bg-[#151821]">Low</option>
                  <option value="Medium" className="bg-[#151821]">Medium</option>
                  <option value="High" className="bg-[#151821]">High</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Description</label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-slate-500">
                <AlignLeft size={18} />
              </div>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-600 outline-none resize-none"
                placeholder="What needs to be done?"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex justify-end gap-3">
            <Link 
              to="/tasks"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors text-sm"
            >
              Cancel
            </Link>
            <motion.button
              type="submit"
              disabled={loading}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="flex justify-center items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <PlusSquare size={18} className="mr-2" />}
              {loading ? 'Creating...' : 'Create Task'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateTask;
