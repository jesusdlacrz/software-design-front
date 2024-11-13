import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
}

const Projects = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Proyecto 1' },
    { id: 2, name: 'Proyecto 2' },
  ]);

  const handleCreateProject = () => {
    // Simulación de creación de proyecto
    const newProject: Project = {
      id: projects.length + 1,
      name: `Proyecto ${projects.length + 1}`,
    };
    setProjects([...projects, newProject]);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Proyectos del Equipo {teamId}</h1>
      <button
        onClick={handleCreateProject}
        className="mb-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Crear Nuevo Proyecto
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleProjectClick(project.id)}
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
