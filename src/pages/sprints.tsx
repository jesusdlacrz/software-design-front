import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Sprint {
  id: number;
  name: string;
}

const Sprints = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [sprints, setSprints] = useState<Sprint[]>([
    { id: 1, name: 'Sprint 1' },
    { id: 2, name: 'Sprint 2' },
  ]);

  const handleCreateSprint = () => {
    // Simulación de creación de sprint
    const newSprint: Sprint = {
      id: sprints.length + 1,
      name: `Sprint ${sprints.length + 1}`,
    };
    setSprints([...sprints, newSprint]);
  };

  const handleSprintClick = (sprintId: number) => {
    navigate(`/projects/${projectId}/sprints/${sprintId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Sprints del Proyecto {projectId}</h1>
      <button
        onClick={handleCreateSprint}
        className="mb-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Crear Nuevo Sprint
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleSprintClick(sprint.id)}
          >
            <h2 className="text-xl font-semibold">{sprint.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sprints;
