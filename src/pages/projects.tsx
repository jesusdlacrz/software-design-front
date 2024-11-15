import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeamProjects } from '../services/projectsUser.service';
import { ToastContainer, toast } from 'react-toastify';

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

  const handleProjectClick = (projectId: number) => {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Proyectos del Equipo {teamId}</h1>
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
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Projects;
