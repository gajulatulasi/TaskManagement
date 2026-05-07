import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  ArrowLeft, 
  Loader2, 
  Users, 
  Calendar, 
  UserCircle,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { pageVariants, staggerContainer, itemVariants, buttonVariants } from '../utils/animations';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const currentUser = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setProject(projectRes.data);
      // Filter tasks for this project
      setTasks(tasksRes.data.filter(t => t.projectId?._id === id || t.projectId === id));
    } catch (err) {
      setError('Failed to load project details');
      if (err.response?.status === 404) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) return;
    
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Todo': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'In Progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Done': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
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

  if (error || !project) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        {error || 'Project not found'}
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link to="/projects" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4 group">
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FolderKanban size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{project.projectName}</h1>
              <div className="flex items-center text-sm text-slate-400 mt-1 gap-4">
                <span className="flex items-center"><UserCircle size={14} className="mr-1.5" /> Created by {project.createdBy?.name || 'Unknown'}</span>
                <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {currentUser?.role === 'Admin' && (
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleDeleteProject}
            className="inline-flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Project
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Members */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#151821] border border-slate-800/80 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Description</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div className="bg-[#151821] border border-slate-800/80 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center">
                <Users size={16} className="mr-2 text-indigo-400" />
                Team Members
              </h2>
              <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {project.members?.length || 0}
              </span>
            </div>
            
            <div className="space-y-3">
              {project.members && project.members.length > 0 ? (
                project.members.map(member => (
                  <div key={member._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-[#0f1117]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No members assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-[#151821] border border-slate-800/80 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-6 py-5 border-b border-slate-800/80 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center">
                <ClipboardList size={16} className="mr-2 text-indigo-400" />
                Project Tasks
              </h2>
              <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-x-auto p-2">
              {tasks.length > 0 ? (
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/80">
                      <th className="px-4 py-3">Task</th>
                      <th className="px-4 py-3">Assignee</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    className="divide-y divide-slate-800/80"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {tasks.map((task) => (
                      <motion.tr variants={itemVariants} key={task._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{task.title}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                              {getInitials(task.assignedTo?.name)}
                            </div>
                            <span className="text-xs text-slate-400">{task.assignedTo?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-slate-400">{task.priority || 'Medium'}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500">
                  <ClipboardList size={32} className="mb-3 opacity-20" />
                  <p className="text-sm text-slate-400 mb-4">No tasks in this project yet.</p>
                  {currentUser?.role === 'Admin' && (
                    <Link to="/tasks/create" className="px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium hover:bg-indigo-600/20 transition-colors">
                      Create Task
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
