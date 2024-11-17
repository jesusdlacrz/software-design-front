import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTeams, createTeam, deleteTeam, deleteUsuarioEquipo } from '../services/teamsUser.service';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Team {
  id: number;
  nombre_equipo: string;
  descripcion_equipo: string;
  usuarioEquipoId?: number;
}

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [descripcionEquipo, setDescripcionEquipo] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTeams = async () => {
      if (userId) {
        try {
          const fetchedTeams = await getUserTeams(userId);
          setTeams(fetchedTeams);
        } catch (error) {
          console.error('Error al cargar los equipos:', error);
          toast.error('Error al cargar los equipos');
        }
      } else {
        toast.error('Usuario no autenticado');
        navigate('/login');
      }
    };
    fetchTeams();
  }, [userId, navigate]);

  const handleTeamClick = (teamId: number) => {
    localStorage.setItem('teamId', teamId.toString());
    navigate(`/teams/${teamId}/projects`);
  };

  const handleCreateTeam = async () => {
    if (!nombreEquipo || !descripcionEquipo) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (!userId) {
      toast.error("Usuario no autenticado");
      return;
    }

    try {
      const newTeam = await createTeam(userId, nombreEquipo, descripcionEquipo);
      setTeams([...teams, newTeam]);
      setNombreEquipo('');
      setDescripcionEquipo('');
      setIsCreating(false);
      toast.success("Equipo creado y asignado exitosamente");
    } catch (error) {
      console.error("Error en handleCreateTeam:", error);
      toast.error("Error al crear y asignar el equipo");
    }
  };

  const handleDeleteTeam = async (teamId: number, usuarioEquipoId?: number) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este equipo?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              if (usuarioEquipoId) {
                await deleteUsuarioEquipo(usuarioEquipoId);
              }
              await deleteTeam(teamId);
              setTeams(teams.filter(team => team.id !== teamId));
              toast.success("Equipo eliminado exitosamente");
            } catch (error) {
              console.error("Error en handleDeleteTeam:", error);
              toast.error("Error al eliminar el equipo");
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

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">Mis Equipos</h1>

      <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
            >
              {isCreating ? 'Cancelar' : 'Crear Nuevo Equipo'}
            </button>
          </div>
      {isCreating && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-gray-700 rounded-lg shadow-md transform transition duration-300 ease-in-out scale-100">
          <h2 className="text-2xl font-semibold text-white mb-4">Nuevo Equipo</h2>
          <input
            type="text"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            placeholder="Nombre del equipo"
            className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

          <input
            type="text"
            value={descripcionEquipo}
            onChange={(e) => setDescripcionEquipo(e.target.value)}
            placeholder="Descripción del equipo"
            className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          <button
            onClick={handleCreateTeam}
            className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition ease-in-out"
          >
            Crear Equipo
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="p-6 bg-gray-700 rounded-lg shadow hover:shadow-lg transition ease-in-out">
            <h2
              className="text-xl font-semibold text-indigo-500 cursor-pointer hover:text-indigo-400 transition"
              onClick={() => handleTeamClick(team.id)}
            >
              {team.nombre_equipo}
            </h2>
            <p className="text-gray-300 mt-2">{team.descripcion_equipo}</p>
            <button
              onClick={() => handleDeleteTeam(team.id, team.usuarioEquipoId)}
              className="inline-flex items-center mt-2 px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md"
            >
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Teams;
