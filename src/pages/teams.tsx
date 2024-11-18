import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserTeams,
  createTeam,
  deleteTeam,
  getAllUsers,
  addUserToTeam,
  getTeamMembers,
} from '../services/teamsUser.service';
import { ToastContainer, toast } from 'react-toastify';
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
  const [teamFilter, setTeamFilter] = useState(''); // New state for the filter
  const userId = localStorage.getItem('userId');
  const [isDeleting, setIsDeleting] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

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
          console.error('Error loading teams:', error);
          toast.error('Error loading teams');
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('User not authenticated');
        navigate('/login');
      }
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Error loading users');
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
      toast.error('Please complete all fields');
      return;
    }

    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const newTeam = await createTeam(userId, nombreEquipo, descripcionEquipo);
      setTeams([...teams, newTeam]);
      setNombreEquipo('');
      setDescripcionEquipo('');
      setIsCreating(false);
      toast.success('Team created and assigned successfully');
      await fetchTeamMembers(newTeam.id); // Fetch members for the new team
    } catch (error) {
      console.error('Error in handleCreateTeam:', error);
      toast.error('Error creating and assigning the team');
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await deleteTeam(teamId);
      setTeams(teams.filter((team) => team.id !== teamId));
      toast.success('Equipo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      toast.error('Error al eliminar el equipo');
    }
  };

  const handleConfirmDelete = () => {
    if (teamToDelete !== null) {
      handleDeleteTeam(teamToDelete);
      setIsDeleting(false);
      setTeamToDelete(null);
    }
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
      toast.error('Please select a user');
      return;
    }

    // Check if the user is already a team member
    const members = teamMembers[teamId] || [];
    if (members.some((member) => member.id === selectedUserId)) {
      toast.error('The user is already a team member. Try another user.');
      return;
    }

    try {
      await addUserToTeam(selectedUserId, teamId);
      toast.success('User added to the team successfully');
      setSelectedUserIds({ ...selectedUserIds, [teamId]: null });
      setEmailFilters({ ...emailFilters, [teamId]: '' });
      setFilteredUsers({ ...filteredUsers, [teamId]: [] });
      setShowModal({ ...showModal, [teamId]: false });
      await fetchTeamMembers(teamId); // Update the team members list
    } catch (error) {
      console.error('Error adding user to the team:', error);
      toast.error('Error adding user to the team');
    }
  };

  const fetchTeamMembers = async (teamId: number) => {
    try {
      const members = await getTeamMembers(teamId);
      setTeamMembers((prevState) => ({ ...prevState, [teamId]: members }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Error fetching team members');
    }
  };

  const handleFilterMembers = (teamId: number, name: string) => {
    setMemberFilters({ ...memberFilters, [teamId]: name });
  };

  // Filter teams based on the search term
  const filteredTeams = teams.filter((team) =>
    team.nombre_equipo.toLowerCase().includes(teamFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">My Teams</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          placeholder="Search team by name"
          className="mr-4 p-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
        />
        <button
          onClick={() => setIsCreating(true)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
        >
          New Team
        </button>
      </div>
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">New Team</h2>
            <input
              type="text"
              value={nombreEquipo}
              onChange={(e) => setNombreEquipo(e.target.value)}
              placeholder="Team name"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              value={descripcionEquipo}
              onChange={(e) => setDescripcionEquipo(e.target.value)}
              placeholder="Team description"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-2 text-red-500 font-semibold rounded border-solid border-2 border-red-600 hover:text-white hover:bg-red-600 transition ease-in-out mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-7 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
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
          {filteredTeams.map((team) => (
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
                  Add User
                </button>
                {showModal[team.id] && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                    <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
                      <h2 className="text-xl font-semibold text-white mb-4">Search by email</h2>
                      <input
                        type="text"
                        value={emailFilters[team.id] || ''}
                        onChange={(e) => handleFilterUsers(team.id, e.target.value)}
                        placeholder="Filter by email"
                        className="mb-3 p-2 bg-gray-600 border border-gray-500 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <ul className="bg-gray-600 rounded-lg shadow-md max-h-40 text-gray-200 overflow-y-auto">
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
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddUserToTeam(team.id)}
                          className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition ease-in-out"
                        >
                          Add
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
                  placeholder="Search collaborator"
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
                          <span className="text-yellow-500">(Creator)</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="">
                <div className="flex justify-end mt-4 absolute right-6 bottom-6">
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                  setTeamToDelete(team.id);
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Confirmar Eliminación</h2>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600 font-semibold rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-7 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition ease-in-out"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Teams;