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
  const teamId = localStorage.getItem('teamId');

  useEffect(() => {
    const fetchProjects = async () => {
      if (teamId) {
        try {
          const fetchedProjects = await getTeamProjects(teamId);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error al cargar los proyectos:', error);
          toast.error('Error al cargar los proyectos');
        }
      } else {
        toast.error('Equipo no seleccionado');
        navigate('/teams');
      }
    };

    fetchProjects();
  }, [teamId, navigate]);

  const handleCreateProject = async () => {
    if (teamId) {
      try {
        const createdProject = await createProject({
          ...newProject,
          equipo_trabajo: parseInt(teamId),
        });
        setProjects([...projects, createdProject]);
        toast.success('Proyecto creado con éxito');
      } catch {
        toast.error('Error al crear proyecto');
      }
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este proyecto?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await deleteProject(projectId);
              setProjects(projects.filter(project => project.id !== projectId));
              toast.success('Proyecto eliminado con éxito');
            } catch {
              toast.error('Error al eliminar proyecto');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Proyectos del Equipo {teamId}</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del Proyecto"
          value={newProject.nombre_proyecto}
          onChange={(e) => setNewProject({ ...newProject, nombre_proyecto: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newProject.descripcion_proyecto}
          onChange={(e) => setNewProject({ ...newProject, descripcion_proyecto: e.target.value })}
        />
        <input
          type="date"
          placeholder="Fecha Inicio"
          value={newProject.fecha_inicio_proyecto}
          onChange={(e) => setNewProject({ ...newProject, fecha_inicio_proyecto: e.target.value })}
        />
        <input
          type="date"
          placeholder="Fecha Fin"
          value={newProject.fecha_fin_proyecto}
          onChange={(e) => setNewProject({ ...newProject, fecha_fin_proyecto: e.target.value })}
        />
        <input
          type="text"
          placeholder="Estado"
          value={newProject.estado_proyecto}
          onChange={(e) => setNewProject({ ...newProject, estado_proyecto: e.target.value })}
        />
        <button onClick={handleCreateProject} className="bg-blue-500 text-white p-2 rounded">
          Crear Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleProjectClick(project.id)}
          >
            <h2 className="text-xl font-semibold">{project.nombre_proyecto}</h2>
            <p className="text-gray-600">{project.descripcion_proyecto}</p>
            <p className="text-gray-500">Estado: {project.estado_proyecto}</p>
            <p className="text-gray-500">
              Fecha inicio: {project.fecha_inicio_proyecto} - Fecha fin: {project.fecha_fin_proyecto}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject(project.id);
              }}
              className="mt-2 bg-red-500 text-white p-1 rounded"
            >
              Eliminar Proyecto
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Projects;
