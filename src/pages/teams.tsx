import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserTeams,
  createTeam,
  deleteTeam,
  deleteUsuarioEquipo,
  getAllUsers,
  addUserToTeam,
  getTeamMembers,
} from '../services/teamsUser.service';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Team {
  id: number;
  nombre_equipo: string;
  descripcion_equipo: string;
  usuarioEquipoId?: number;
}

interface User {
  id: number;
  nombre: string;
  email: string;
}

interface TeamMember {
  id: number;
  nombre: string;
  email: string;
  es_creador: boolean;
}

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{ [key: number]: User[] }>({});
  const [emailFilters, setEmailFilters] = useState<{ [key: number]: string }>({});
  const [selectedUserIds, setSelectedUserIds] = useState<{ [key: number]: number | null }>({});
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: TeamMember[] }>({});
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [descripcionEquipo, setDescripcionEquipo] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState<{ [key: number]: boolean }>({});
  const [memberFilters, setMemberFilters] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTeams = async () => {
      if (userId) {
        try {
          const fetchedTeams = await getUserTeams(userId);
          setTeams(fetchedTeams);
          // Fetch team members for each team
          await Promise.all(
            fetchedTeams.map(async (team: Team) => {
              await fetchTeamMembers(team.id);
            })
          );
        } catch (error) {
          console.error('Error al cargar los equipos:', error);
          toast.error('Error al cargar los equipos');
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('Usuario no autenticado');
        navigate('/login');
      }
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        toast.error('Error al cargar los usuarios');
      }
    };

    fetchTeams();
    fetchUsers();
  }, [userId, navigate]);

  const handleTeamClick = (teamId: number) => {
    localStorage.setItem('teamId', teamId.toString());
    navigate(`/teams/${teamId}/projects`);
  };

  const handleCreateTeam = async () => {
    if (!nombreEquipo || !descripcionEquipo) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    if (!userId) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      const newTeam = await createTeam(userId, nombreEquipo, descripcionEquipo);
      setTeams([...teams, newTeam]);
      setNombreEquipo('');
      setDescripcionEquipo('');
      setIsCreating(false);
      toast.success('Equipo creado y asignado exitosamente');
      await fetchTeamMembers(newTeam.id); // Fetch members for the new team
    } catch (error) {
      console.error('Error en handleCreateTeam:', error);
      toast.error('Error al crear y asignar el equipo');
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
              setTeams(teams.filter((team) => team.id !== teamId));
              toast.success('Equipo eliminado exitosamente');
            } catch (error) {
              console.error('Error en handleDeleteTeam:', error);
              toast.error('Error al eliminar el equipo');
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleFilterUsers = (teamId: number, email: string) => {
    setEmailFilters({ ...emailFilters, [teamId]: email });
    const filtered = users.filter((user) => user.email.includes(email));
    setFilteredUsers({ ...filteredUsers, [teamId]: filtered });
  };

  const handleSelectUser = (teamId: number, user: User) => {
    setSelectedUserIds({ ...selectedUserIds, [teamId]: user.id });
    setEmailFilters({ ...emailFilters, [teamId]: user.email });
    setFilteredUsers({ ...filteredUsers, [teamId]: [] });
  };

  const handleAddUserToTeam = async (teamId: number) => {
    const selectedUserId = selectedUserIds[teamId];
    if (selectedUserId === null) {
      toast.error('Por favor seleccione un usuario');
      return;
    }

    // Verificar si el usuario ya es miembro del equipo
    const members = teamMembers[teamId] || [];
    if (members.some((member) => member.id === selectedUserId)) {
      toast.error('El usuario ya es miembro del equipo. Intente con otro usuario.');
      return;
    }

    try {
      await addUserToTeam(selectedUserId, teamId);
      toast.success('Usuario añadido al equipo exitosamente');
      setSelectedUserIds({ ...selectedUserIds, [teamId]: null });
      setEmailFilters({ ...emailFilters, [teamId]: '' });
      setFilteredUsers({ ...filteredUsers, [teamId]: [] });
      setShowModal({ ...showModal, [teamId]: false });
      await fetchTeamMembers(teamId); // Actualizar la lista de miembros del equipo
    } catch (error) {
      console.error('Error al añadir usuario al equipo:', error);
      toast.error('Error al añadir usuario al equipo');
    }
  };

  const fetchTeamMembers = async (teamId: number) => {
    try {
      const members = await getTeamMembers(teamId);
      setTeamMembers((prevState) => ({ ...prevState, [teamId]: members }));
    } catch (error) {
      console.error('Error al obtener miembros del equipo:', error);
      toast.error('Error al obtener miembros del equipo');
    }
  };

  const handleFilterMembers = (teamId: number, name: string) => {
    setMemberFilters({ ...memberFilters, [teamId]: name });
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">Mis Equipos</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
        >
          Crear Nuevo Equipo
        </button>
      </div>
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
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
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-2 text-red-500 font-semibold rounded border-solid border-2 border-red-600 hover:text-white hover:bg-red-600 transition ease-in-out mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-7 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        // Mostrar skeleton loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-lg"
            >
              <div>
                <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                <div className="w-28 h-4 bg-slate-400 mt-3 rounded-md"></div>
              </div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="relative p-6 bg-gray-700 rounded-lg shadow hover:shadow-lg transition ease-in-out"
            >
              <h2
                className="text-xl font-semibold text-indigo-500 cursor-pointer hover:text-indigo-400 transition break-words"
                onClick={() => handleTeamClick(team.id)}
              >
                {team.nombre_equipo}
              </h2>
              <p className="text-gray-300 mt-2 break-words">{team.descripcion_equipo}</p>
              <div className="mt-4">
                <button
                  onClick={() => setShowModal({ ...showModal, [team.id]: true })}
                  className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
                >
                  Añadir Usuario
                </button>
                {showModal[team.id] && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                    <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
                      <h2 className="text-xl font-semibold text-white mb-4">Search email</h2>
                      <input
                        type="text"
                        value={emailFilters[team.id] || ''}
                        onChange={(e) => handleFilterUsers(team.id, e.target.value)}
                        placeholder="Filtrar por correo"
                        className="mb-3 p-2 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <ul className="bg-gray-600 rounded-lg shadow-md max-h-40 overflow-y-auto">
                        {(filteredUsers[team.id] || []).map((user) => (
                          <li
                            key={user.id}
                            className={`p-2 cursor-pointer ${
                              selectedUserIds[team.id] === user.id
                                ? 'bg-indigo-500'
                                : 'hover:bg-gray-500'
                            }`}
                            onClick={() => handleSelectUser(team.id, user)}
                          >
                            {user.email}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setShowModal({ ...showModal, [team.id]: false })}
                          className="px-2 py-2 text-red-500 font-semibold rounded border-solid border-2 border-red-600 hover:text-white hover:bg-red-600 transition ease-in-out mr-2"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleAddUserToTeam(team.id)}
                          className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 mb-16">
                <input
                  type="text"
                  value={memberFilters[team.id] || ''}
                  onChange={(e) => handleFilterMembers(team.id, e.target.value)}
                  placeholder="Buscar colaborador"
                  className="mb-3 p-2 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ul className="bg-gray-600 rounded-lg shadow-md max-h-40 overflow-y-auto">
                  {(teamMembers[team.id] || [])
                    .filter((member) =>
                      member.nombre.includes(memberFilters[team.id] || '')
                    )
                    .map((member) => (
                      <li key={member.id} className="p-2 text-white">
                        {member.nombre} ({member.email}){' '}
                        {member.es_creador && (
                          <span className="text-yellow-500">(Creador)</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="">
                <div className="flex justify-end mt-4 absolute right-6 bottom-6">
                  <button
                    onClick={() => handleDeleteTeam(team.id, team.usuarioEquipoId)}
                    className="px-4 inline-flex py-2 text-red-500 hover:text-white hover:bg-red-600 font-semibold rounded border-dashed border-2 border-red-600 transition ease-in-out"
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
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Teams;