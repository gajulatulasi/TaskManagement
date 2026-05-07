import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Mail, Shield, Loader2, ShieldCheck, User } from 'lucide-react';
import { pageVariants, staggerContainer, itemVariants } from '../utils/animations';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load team directory');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            <Users className="mr-3 text-indigo-400" size={24} />
            Team Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and view all registered members of the platform.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
          {error}
        </div>
      )}

      {users.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#151821] border border-slate-800/80 rounded-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
            <Users size={32} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No team members found</h3>
          <p className="text-sm text-slate-400 max-w-sm text-center">
            Your platform doesn't have any registered users yet.
          </p>
        </div>
      ) : (
        <div className="bg-[#151821] border border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#0f1117]/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/80">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-slate-800/80"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {users.map((user) => (
                  <motion.tr variants={itemVariants} key={user._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">{user.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">ID: {user._id.substring(user._id.length - 6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        <Mail size={14} className="mr-2 text-slate-500" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5">
                        {user.role === 'Admin' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <ShieldCheck size={14} className="mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            <User size={14} className="mr-1" />
                            Member
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date().toLocaleDateString()} {/* Assuming createdAt isn't available, placeholder */}
                    </td>
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

export default Team;
