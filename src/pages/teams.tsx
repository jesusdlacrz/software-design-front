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
      <h1 className="text-3xl font-bold mb-4">Mis Equipos</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Crear Nuevo Equipo</h2>
        <input
          type="text"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          placeholder="Nombre del equipo"
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          value={descripcionEquipo}
          onChange={(e) => setDescripcionEquipo(e.target.value)}
          placeholder="Descripción del equipo"
          className="mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear Equipo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold cursor-pointer" onClick={() => handleTeamClick(team.id)}>
              {team.nombre_equipo}
            </h2>
            <p className="text-gray-600">{team.descripcion_equipo}</p>
            <button
              onClick={() => handleDeleteTeam(team.id, team.usuarioEquipoId)}
              className="mt-2 px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
