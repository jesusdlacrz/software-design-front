import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Projects from "../pages/projects";
import Sprints from "../pages/sprints";
import Tasks from "../pages/tasks";
import Teams from "../pages/teams";
export const router = createBrowserRouter(
  [
    {
      path: `/login`,   
      element: <Login />,
    },
    {
      path: `/register`,
      element: <Register />,
    },
    {
        path: `/teams`,
        element: <Teams />,
    },
    {
      path: `/teams/:id/projects`,
      element: <Projects />,
    },
    {
      path: `/teams/:id/projects/:projectId/sprints`,
      element: <Sprints />,
    },
    {
      path: `/teams/:id/projects/:projectId/sprints/:sprintId/tasks`,
      element: <Tasks />,
    },
    
  ],
);