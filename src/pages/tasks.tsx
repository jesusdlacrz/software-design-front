// src/pages/tasks.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, getTasks, deleteTask } from '../services/tasks.service';
import { ToastContainer, toast } from 'react-toastify';
import { getUsersByTeam } from '../services/usuariosPorEquipo.service';

interface Task {
  id: number;
  nombre_tarea: string;
  descripcion_tarea: string;
  estado_tarea: string;
  fecha_inicio_tarea: string;
  fecha_fin_tarea: string;
  usuario: number;
}

const Tasks = () => {
  const navigate = useNavigate();
  const { id, sprintId } = useParams<{ id: string; sprintId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    nombre_tarea: '',
    descripcion_tarea: '',
    estado_tarea: '',
    usuario: '',
    fecha_fin_tarea: '',
  });
  const [users, setUsers] = useState<{ id: number; nombre: string }[]>([]);
  const [taskFilter, setTaskFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (sprintId) {
        try {
          const data = await getTasks(Number(sprintId));
          setTasks(data);
          console.log('Tareas obtenidas:', data);
        } catch (error) {
          console.error('Error al cargar las tareas:', error);
          toast.error('Error al cargar las tareas');
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('Sprint no seleccionado');
        navigate('/sprints');
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [sprintId, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (id) {
        try {
          const data = await getUsersByTeam(Number(id));
          setUsers(data);
        } catch (error) {
          console.error('Error al cargar los usuarios:', error);
          toast.error('Error al cargar los usuarios');
        }
      } else {
        console.error('teamId no está definido');
      }
    };

    fetchUsers();
  }, [id]);

  const handleCreateTask = async () => {
    if (sprintId) {
      try {
        const createdTask = await createTask({
          ...newTask,
          sprint: parseInt(sprintId),
          usuario: parseInt(newTask.usuario),
        });
        setTasks([...tasks, createdTask]);
        toast.success('Tarea creada con éxito');
        setNewTask({
          nombre_tarea: '',
          descripcion_tarea: '',
          estado_tarea: '',
          usuario: '',
          fecha_fin_tarea: '',
        });
        setIsCreating(false);
      } catch (error) {
        console.error('Error al crear la tarea:', error);
        toast.error('Error al crear la tarea');
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success('Tarea eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      handleDeleteTask(taskToDelete);
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  const handleTaskClick = () => {
    // Implementar la lógica para manejar el clic en una tarea
  };

  const filteredTasks = tasks.filter((task) =>
    task.nombre_tarea.toLowerCase().includes(taskFilter.toLowerCase())
  );

  const getUserName = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.nombre : 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-white">Tareas del Sprint {sprintId}</h1>
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            placeholder="Buscar tarea por nombre"
            className="mr-4 p-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
          />
          <button
            onClick={() => setIsCreating(true)}
            className="text-white bg-indigo-500 hover:bg-indigo-600 transition ease-in-out text-sm px-4 py-2 border border-indigo-500 rounded focus:outline-none"
          >
            Nueva Tarea
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-lg">
              <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
              <div className="w-28 h-4 bg-slate-400 mt-3 rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-full rounded-md"></div>
              <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="relative p-6 bg-gray-700 rounded-lg shadow hover:shadow-lg transition ease-in-out"
              onClick={() => handleTaskClick()}
            >
              <h2 className="text-xl font-semibold text-indigo-500 cursor-pointer hover:text-indigo-400 transition break-words">
                {task.nombre_tarea}
              </h2>
              <p className="text-gray-300 mt-2 break-words">{task.descripcion_tarea}</p>
              <p className="text-gray-400 mt-2">Encargado: {getUserName(task.usuario)}</p>
              <p className="text-gray-400">Estado: {task.estado_tarea}</p>
              <p className="text-gray-400">Fecha de inicio: {task.fecha_inicio_tarea}</p>
              <p className="text-gray-400 mb-12">Fecha de fin: {task.fecha_fin_tarea}</p>
              <div className="flex justify-end mt-4 absolute right-6 bottom-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleting(true);
                    setTaskToDelete(task.id);
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
          ))}
        </div>
      )}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Nueva Tarea</h2>
            <input
              type="text"
              value={newTask.nombre_tarea}
              onChange={(e) => setNewTask({ ...newTask, nombre_tarea: e.target.value })}
              placeholder="Nombre de la Tarea"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            />
            <textarea
              value={newTask.descripcion_tarea}
              onChange={(e) => setNewTask({ ...newTask, descripcion_tarea: e.target.value })}
              placeholder="Descripción"
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full h-24 text-white"
            ></textarea>
            <input
              type="date"
              value={newTask.fecha_fin_tarea}
              onChange={(e) => setNewTask({ ...newTask, fecha_fin_tarea: e.target.value })}
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            />
            <select
              value={newTask.estado_tarea}
              onChange={(e) => setNewTask({ ...newTask, estado_tarea: e.target.value })}
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            >
              <option value="">Estado de la Tarea</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
            <select
              value={newTask.usuario}
              onChange={(e) => setNewTask({ ...newTask, usuario: e.target.value })}
              className="mb-3 p-3 bg-gray-600 border border-gray-500 rounded w-full text-white"
            >
              <option value="">Asignar a Usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-2 text-red-500 font-semibold rounded border border-red-600 hover:text-white hover:bg-red-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="px-7 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Confirmar Eliminación</h2>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
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

export default Tasks;