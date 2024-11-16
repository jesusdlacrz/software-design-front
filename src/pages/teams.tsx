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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Mis Equipos</h1>

      {/* Botón para desplegar formulario de creación de equipo */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-blue-600 hover:text-blue-700 transition ease-in-out text-sm px-4 py-2 border border-blue-600 rounded-full focus:outline-none"
        >
          {isCreating ? 'Cancelar' : 'Crear Nuevo Equipo'}
        </button>
      </div>

      {/* Formulario de creación de equipo con animación */}
      {isCreating && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow-md transform transition duration-300 ease-in-out scale-100">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nuevo Equipo</h2>
          <input
            type="text"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            placeholder="Nombre del equipo"
            className="mb-3 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={descripcionEquipo}
            onChange={(e) => setDescripcionEquipo(e.target.value)}
            placeholder="Descripción del equipo"
            className="mb-3 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCreateTeam}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition ease-in-out"
          >
            Crear Equipo
          </button>
        </div>
      )}

      {/* Lista de equipos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition ease-in-out">
            <h2
              className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-700 transition"
              onClick={() => handleTeamClick(team.id)}
            >
              {team.nombre_equipo}
            </h2>
            <p className="text-gray-600 mt-2">{team.descripcion_equipo}</p>
            <button
              onClick={() => handleDeleteTeam(team.id, team.usuarioEquipoId)}
              className="mt-4 px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition ease-in-out"
            >
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
