import { createBrowserRouter } from 'react-router-dom';
import Register from '../pages/register';
import Login from '../pages/login';
import Teams from '../pages/teams';
import Projects from '../pages/projects';
import Sprints from '../pages/sprints';
import Tasks from '../pages/tasks';
import LandingPage from '../pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/teams',
    element: <Teams />,
  },
  {
    path: '/teams/:id/projects',
    element: <Projects />,
  },
  {
    path: '/teams/:id/projects/:projectId/sprints',
    element: <Sprints />,
  },
  {
    path: '/projects/:projectId/sprints/:sprintId/tasks',
    element: <Tasks />,
  },
]);