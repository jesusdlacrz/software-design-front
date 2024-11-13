import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
}

const Home = () => {
  const navigate = useNavigate();

  // Datos ficticios de equipos
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Equipo A' },
    { id: 2, name: 'Equipo B' },
  ]);

  const handleCreateTeam = () => {
    // Simulación de creación de equipo
    const newTeam: Team = {
      id: teams.length + 1,
      name: `Equipo ${String.fromCharCode(65 + teams.length)}`,
    };
    setTeams([...teams, newTeam]);
  };

  const handleTeamClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Mis Equipos</h1>
      <button
        onClick={handleCreateTeam}
        className="mb-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Crear Nuevo Equipo
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleTeamClick(team.id)}
          >
            <h2 className="text-xl font-semibold">{team.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
