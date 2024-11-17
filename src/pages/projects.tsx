import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeamProjects, createProject, deleteProject } from '../services/projectsUser.service';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Project {
  id: number;
  nombre_proyecto: string;
  descripcion_proyecto: string;
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  estado_proyecto: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    nombre_proyecto: '',
    descripcion_proyecto: '',
    fecha_inicio_proyecto: '',
    fecha_fin_proyecto: '',
    estado_proyecto: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [projectFilter, setProjectFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const teamId = localStorage.getItem('teamId');

  useEffect(() => {
    const fetchProjects = async () => {
      if (teamId) {
        try {
          const fetchedProjects = await getTeamProjects(teamId);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
          toast.error('Error loading projects');
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('Team not selected');
        navigate('/teams');
      }
    };

    fetchProjects();
  }, [teamId, navigate]);

  const handleCreateProject = async () => {
    if (
      !newProject.nombre_proyecto ||
      !newProject.descripcion_proyecto ||
      !newProject.fecha_inicio_proyecto ||
      !newProject.fecha_fin_proyecto ||
      !newProject.estado_proyecto
    ) {
      toast.error('Please complete all fields');
      return;
    }

    if (teamId) {
      try {
        const createdProject = await createProject({
          ...newProject,
          equipo_trabajo: parseInt(teamId),
        });
        setProjects([...projects, createdProject]);
        toast.success('Project created successfully');
        setNewProject({
          nombre_proyecto: '',
          descripcion_proyecto: '',
          fecha_inicio_proyecto: '',
          fecha_fin_proyecto: '',
          estado_proyecto: '',
        });
        setIsCreating(false);
      } catch {
        toast.error('Error creating project');
      }
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this project?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteProject(projectId);
              setProjects(projects.filter((project) => project.id !== projectId));
              toast.success('Project deleted successfully');
            } catch {
              toast.error('Error deleting project');
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  };

  const filteredProjects = projects.filter((project) =>
    project.nombre_proyecto.toLowerCase().includes(projectFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
        Team Projects {teamId}
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          placeholder="Search project by name"
          className="mr-4 p-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
        />
        <button
          onClick={() => setIsCreating(true)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
        >
          New Project
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">New Project</h2>
            <input
              type="text"
              value={newProject.nombre_proyecto}
              onChange={(e) => setNewProject({ ...newProject, nombre_proyecto: e.target.value })}
              placeholder="Project Name"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              value={newProject.descripcion_proyecto}
              onChange={(e) =>
                setNewProject({ ...newProject, descripcion_proyecto: e.target.value })
              }
              placeholder="Description"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={newProject.fecha_inicio_proyecto}
              onChange={(e) =>
                setNewProject({ ...newProject, fecha_inicio_proyecto: e.target.value })
              }
              placeholder="Start Date"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={newProject.fecha_fin_proyecto}
              onChange={(e) =>
                setNewProject({ ...newProject, fecha_fin_proyecto: e.target.value })
              }
              placeholder="End Date"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              value={newProject.estado_proyecto}
              onChange={(e) =>
                setNewProject({ ...newProject, estado_proyecto: e.target.value })
              }
              placeholder="Status"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-2 text-red-500 font-semibold rounded border border-red-600 hover:text-white hover:bg-red-600 transition ease-in-out mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-7 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-lg"
            >
              <div>
                <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                <div className="w-28 h-4 bg-slate-400 mt-3 rounded-md"></div>
              </div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative p-6 bg-gray-700 rounded-lg shadow hover:shadow-lg transition ease-in-out"
              onClick={() => handleProjectClick(project.id)}
            >
              <h2 className="text-xl font-semibold text-indigo-500 cursor-pointer hover:text-indigo-400 transition break-words">
                {project.nombre_proyecto}
              </h2>
              <p className="text-gray-300 mt-2 break-words">{project.descripcion_proyecto}</p>
              <p className="text-gray-400">Status: {project.estado_proyecto}</p>
              <p className="text-gray-400 mb-12">
                Start Date: {project.fecha_inicio_proyecto} - End Date: {project.fecha_fin_proyecto}
              </p>
              <div className="flex justify-end mt-4 absolute right-6 bottom-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                className="px-4 inline-flex py-2 text-red-500 hover:text-white hover:bg-red-600 font-semibold rounded border-dashed border-2 border-red-600 transition ease-in-out"
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Projects;
