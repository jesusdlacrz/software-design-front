import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTeams } from '../services/teamsUser.service';
import { ToastContainer, toast } from 'react-toastify';

interface Team {
  id: number;
  nombre_equipo: string;
  descripcion_equipo: string;
}

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Mis Equipos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleTeamClick(team.id)}
          >
            <h2 className="text-xl font-semibold">{team.nombre_equipo}</h2>
            <p className="text-gray-600">{team.descripcion_equipo}</p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Teams;
