// src/pages/sprints.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSprints, createSprint, deleteSprint } from '../services/sprints.service';
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
  const { id, projectId } = useParams<{ id: string; projectId: string }>();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [newSprint, setNewSprint] = useState({
    nombre_sprint: '',
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [sprintFilter, setSprintFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      if (projectId) {
        try {
          const data = await getSprints(Number(projectId));
          setSprints(data);
          console.log('Sprints obtenidos:', data);
        } catch (error) {
          console.error('Error al cargar los sprints:', error);
          toast.error('Error al cargar los sprints');
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('Proyecto no seleccionado');
        navigate('/projects');
        setIsLoading(false);
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
        setIsCreating(false);
      } catch (error) {
        console.error('Error al crear sprint:', error);
        toast.error('Error al crear sprint');
      }
    }
  };

  const handleDeleteSprint = async (sprintId: number) => {
    try {
      await deleteSprint(sprintId);
      setSprints(sprints.filter((sprint) => sprint.id !== sprintId));
      toast.success('Sprint eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el sprint:', error);
      toast.error('Error al eliminar el sprint');
    }
  };

  const handleSprintClick = (sprintId: number) => {
    navigate(`/teams/${id}/projects/${projectId}/sprints/${sprintId}/tasks`);
  };

  const filteredSprints = sprints.filter((sprint) =>
    sprint.nombre_sprint.toLowerCase().includes(sprintFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
        Sprints del Proyecto {projectId}
      </h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={sprintFilter}
          onChange={(e) => setSprintFilter(e.target.value)}
          placeholder="Search sprint by name"
          className="mr-4 p-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
        />
        <button
          onClick={() => setIsCreating(true)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
        >
          New Sprint
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse p-6 bg-gray-700 rounded-lg">
              <div className="w-48 h-6 bg-gray-600 rounded-md mb-4"></div>
              <div className="w-full h-4 bg-gray-600 rounded-md"></div>
              <div className="w-full h-4 bg-gray-600 rounded-md mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSprints.map((sprint) => (
            <div
              key={sprint.id}
              className="relative p-6 bg-gray-700 rounded-lg shadow hover:shadow-lg transition ease-in-out"
            >
              <h2
                className="text-xl font-semibold text-indigo-500 cursor-pointer hover:text-indigo-400 transition"
                onClick={() => handleSprintClick(sprint.id)}
              >
                {sprint.nombre_sprint}
              </h2>
              <p className="text-gray-300 mt-2">
                Start Date: {sprint.fecha_inicio}
              </p>
              <p className="text-gray-300">
                Due Date: {sprint.fecha_fin}
              </p>
              <div className="flex justify-end mt-4 absolute right-6 bottom-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSprint(sprint.id);
                  }}
                  className="px-4 py-2 text-red-500 hover:text-white hover:bg-red-600 font-semibold rounded border-dashed border-2 border-red-600 transition ease-in-out"
                >
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 7L5 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M10 11V17"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M14 11V17"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M5 7L6 19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19L19 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Nuevo Sprint</h2>
            <input
              type="text"
              value={newSprint.nombre_sprint}
              onChange={(e) => setNewSprint({ ...newSprint, nombre_sprint: e.target.value })}
              placeholder="Nombre del Sprint"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            />
            <input
              type="date"
              value={newSprint.fecha_inicio}
              onChange={(e) => setNewSprint({ ...newSprint, fecha_inicio: e.target.value })}
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            />
            <input
              type="date"
              value={newSprint.fecha_fin}
              onChange={(e) => setNewSprint({ ...newSprint, fecha_fin: e.target.value })}
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-red-500 font-semibold rounded border border-red-600 hover:text-white hover:bg-red-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSprint}
                className="px-7 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Sprints;