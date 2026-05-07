import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
      <div className="text-center p-8 bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} className="text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You do not have the necessary permissions to view this page. If you believe this is a mistake, please contact your administrator.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 border border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
