import { createBrowserRouter } from 'react-router-dom';
import Register from '../pages/register';
import Login from '../pages/login';
import Teams from '../pages/teams';
import Projects from '../pages/projects';
import Sprints from '../pages/sprints';
import Tasks from '../pages/tasks';

export const router = createBrowserRouter([
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
    path: '/teams/:id/projects/:projectId',
    element: <Sprints />,
  },
  {
    path: '/projects/:projectId/sprints/:sprintId',
    element: <Tasks />,
  },
]);