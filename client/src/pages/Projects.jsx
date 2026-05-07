import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Loader2, Plus, ArrowRight, Layers } from 'lucide-react';
import { pageVariants, staggerContainer, itemVariants, buttonVariants } from '../utils/animations';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const currentUser = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchProjects();
    if (currentUser?.role === 'Admin') {
      fetchUsers();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleAddMember = async (projectId) => {
    if (!selectedUser) return;
    setAddingMember(true);
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}/add-member`, 
        { userId: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProjects();
      setSelectedProject(null);
      setSelectedUser('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
            <Layers className="mr-3 text-indigo-400" size={24} />
            Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track your team's initiatives.</p>
        </div>
        
        {currentUser?.role === 'Admin' && (
          <Link
            to="/projects/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus size={16} className="mr-1.5" />
            New Project
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#151821] border border-slate-800/80 rounded-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
            <FolderKanban size={32} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No projects yet</h3>
          <p className="text-sm text-slate-400 max-w-sm text-center mb-6">
            {currentUser?.role === 'Admin' 
              ? "Create a project to start organizing your team's tasks." 
              : "You haven't been assigned to any projects yet."}
          </p>
          {currentUser?.role === 'Admin' && (
            <Link
              to="/projects/create"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Create First Project
            </Link>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <motion.div variants={itemVariants} key={project._id} className="bg-[#151821] border border-slate-800/80 rounded-xl flex flex-col group hover:border-slate-700 transition-colors shadow-sm overflow-hidden">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/projects/${project._id}`} className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 hover:underline">
                    {project.projectName}
                  </Link>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="px-5 py-4 bg-[#0f1117]/50 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {project.members?.slice(0, 4).map((member, i) => (
                      <div 
                        key={member._id} 
                        className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#151821] flex items-center justify-center text-[10px] font-bold text-slate-300"
                        title={member.name}
                        style={{ zIndex: 10 - i }}
                      >
                        {getInitials(member.name)}
                      </div>
                    ))}
                    {project.members?.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#151821] flex items-center justify-center text-[10px] font-bold text-slate-400" style={{ zIndex: 5 }}>
                        +{project.members.length - 4}
                      </div>
                    )}
                    {(!project.members || project.members.length === 0) && (
                      <span className="text-xs text-slate-500">No members</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-500 font-medium">
                    Created by {project.createdBy?.name?.split(' ')[0] || 'Unknown'}
                  </div>
                </div>

                {/* Admin Add Member Section */}
                {currentUser?.role === 'Admin' && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    {selectedProject === project._id ? (
                      <div className="flex items-center gap-2">
                        <select 
                          className="flex-grow bg-[#0f1117] border border-slate-700 rounded-lg text-xs px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-300"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                        >
                          <option value="">Select user...</option>
                          {users
                            .filter(u => !project.members.some(m => m._id === u._id))
                            .map(u => (
                              <option key={u._id} value={u._id}>{u.name}</option>
                            ))
                          }
                        </select>
                        <motion.button 
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleAddMember(project._id)}
                          disabled={!selectedUser || addingMember}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          {addingMember ? '...' : 'Add'}
                        </motion.button>
                        <motion.button 
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setSelectedProject(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button 
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedProject(project._id)}
                        className="w-full py-1.5 border border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
                      >
                        <Users size={14} className="mr-1.5" /> Manage Team
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Projects;
