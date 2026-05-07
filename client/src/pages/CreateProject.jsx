import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FolderPlus, ArrowLeft, Loader2, Type, AlignLeft } from 'lucide-react';
import { pageVariants, buttonVariants } from '../utils/animations';

const CreateProject = () => {
  const [formData, setFormData] = useState({ projectName: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/projects" className="mr-4 p-2 bg-[#151821] hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            Create Project
          </h1>
          <p className="text-sm text-slate-400 mt-1">Start a new initiative for your team.</p>
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Project Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Type size={18} />
              </div>
              <input
                type="text"
                name="projectName"
                required
                value={formData.projectName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1117]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-600 outline-none"
                placeholder="e.g. Website Redesign"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Description (Optional)</label>
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
                placeholder="Briefly describe the project goals..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex justify-end gap-3">
            <Link 
              to="/projects"
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
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <FolderPlus size={18} className="mr-2" />}
              {loading ? 'Creating...' : 'Create Project'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProject;
