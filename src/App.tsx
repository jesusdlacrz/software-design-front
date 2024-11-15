import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Teams from './pages/teams';
import Projects from './pages/projects'; 
import Sprints from './pages/sprints'; 
import Tasks from './pages/tasks';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/:id/projects" element={<Projects />} />
      <Route path="/teams/:id/projects/:projectId" element={<Sprints />} />
      <Route path="/projects/:projectId/sprints/:sprintId" element={<Tasks />} /> {/* Ruta de Tareas */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
