// src/pages/sprints.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSprints, createSprint } from '../services/sprints.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Sprint {
  id: number;
  nombre_sprint: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const Sprints = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [newSprint, setNewSprint] = useState({
    nombre_sprint: '',
    fecha_inicio: '',
    fecha_fin: '',
  });
  const teamId = localStorage.getItem('teamId');

  useEffect(() => {
    const fetchSprints = async () => {
      if (projectId) {
        try {
          const data = await getSprints(Number(projectId));
          setSprints(data);
        } catch (error) {
          console.error('Error al cargar los sprints:', error);
          toast.error('Error al cargar los sprints');
        }
      } else {
        toast.error('Proyecto no seleccionado');
        navigate('/projects');
      }
    };

    fetchSprints();
  }, [projectId, navigate]);

  const handleCreateSprint = async () => {
    if (projectId) {
      try {
        const createdSprint = await createSprint({
          ...newSprint,
          proyecto: parseInt(projectId),
        });
        setSprints([...sprints, createdSprint]);
        toast.success('Sprint creado con éxito');
        setNewSprint({
          nombre_sprint: '',
          fecha_inicio: '',
          fecha_fin: '',
        });
      } catch (error) {
        console.error('Error al crear sprint:', error);
        toast.error('Error al crear sprint');
      }
    }
  };

  const handleSprintClick = (sprintId: number) => {
    navigate(`/teams/${teamId}/projects/${projectId}/sprints/${sprintId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Sprints del Proyecto {projectId}</h1>
      {/* Formulario para crear un nuevo sprint */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Sprint</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateSprint(); }}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nombre del Sprint</label>
            <input
              type="text"
              value={newSprint.nombre_sprint}
              onChange={(e) => setNewSprint({ ...newSprint, nombre_sprint: e.target.value })}
              // ...
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Fecha de Inicio</label>
            <input
              type="date"
              value={newSprint.fecha_inicio}
              onChange={(e) => setNewSprint({ ...newSprint, fecha_inicio: e.target.value })}
              // ...
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Fecha de Fin</label>
            <input
              type="date"
              value={newSprint.fecha_fin}
              onChange={(e) => setNewSprint({ ...newSprint, fecha_fin: e.target.value })}
              // ...
            />
          </div>
          <button type="submit">Crear Sprint</button>
        </form>
      </div>
      {/* Lista de sprints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleSprintClick(sprint.id)}
          >
            <h2 className="text-xl font-semibold">{sprint.nombre_sprint}</h2>
            <p className="text-gray-600">
              Fecha inicio: {sprint.fecha_inicio} - Fecha fin: {sprint.fecha_fin}
            </p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sprints;