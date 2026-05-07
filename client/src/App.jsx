import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import Team from './pages/Team';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f1117] font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/tasks" element={<Tasks />} />
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/projects/create" element={<CreateProject />} />
                <Route path="/tasks/create" element={<CreateTask />} />
                <Route path="/team" element={<Team />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
