// src/pages/tasks.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, getTasks } from '../services/tasks.service';
import { ToastContainer, toast } from 'react-toastify';
import { getUsersByTeam } from '../services/usuariosPorEquipo.service';

interface Task {
  id: number;
  nombre_tarea: string;
  descripcion_tarea: string;
  estado_tarea: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

const Tasks = () => {
  const navigate = useNavigate();
  const { id ,projectId, sprintId } = useParams<{
    id: string;
    projectId: string;
    sprintId: string;
  }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    nombre_tarea: '',
    descripcion_tarea: '',
    estado_tarea: '',
    usuario: '', // Cambiado a usuario_id
    fecha_fin_tarea: '',
  });
  const [users, setUsers] = useState<{ id: number; nombre: string }[]>([]);
  

  useEffect(() => {
    const fetchTasks = async () => {
      if (sprintId) {
        try {
          const data = await getTasks(Number(sprintId));
          setTasks(data);
        } catch (error) {
          console.error('Error al cargar las tareas:', error);
          toast.error('Error al cargar las tareas');
        }
      } else {
        toast.error('Sprint no seleccionado');
        navigate('/sprints');
      }
    };
  
    fetchTasks();
  }, [sprintId, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log('este es el id: ' + id);
      if (id) {
        try {
          const data = await getUsersByTeam(Number(id));
          console.log('Usuarios obtenidos:', data);
          // Mapea los datos para obtener solo id y nombre
          const usersList = data.map((user: any) => ({
            id: user.id,
            nombre: user.nombre,
          }));
          console.log('Usuarios mapeados:', usersList);
          setUsers(usersList);
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

  // Aquí implementamos handleCreateTask
  const handleCreateTask = async () => {
    if (sprintId) {
      try {
        const createdTask = await createTask({
          ...newTask,
          sprint: parseInt(sprintId),
          usuario: parseInt(newTask.usuario), // Convertimos a número
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
      } catch (error) {
        console.error('Error al crear la tarea:', error);
        toast.error('Error al crear la tarea');
      }
    }
  };

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem('taskId', taskId.toString());
    navigate(`/teams/${id}/projects/${projectId}/sprints/${sprintId}/tasks/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Tareas del Sprint {sprintId}</h1>
      {/* Formulario para crear una nueva tarea */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Tarea</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask();
          }}
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nombre de la Tarea</label>
            <input
              type="text"
              value={newTask.nombre_tarea}
              onChange={(e) => setNewTask({ ...newTask, nombre_tarea: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Descripción</label>
            <textarea
              value={newTask.descripcion_tarea}
              onChange={(e) => setNewTask({ ...newTask, descripcion_tarea: e.target.value })}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Estado</label>
            <input
              type="text"
              value={newTask.estado_tarea}
              onChange={(e) => setNewTask({ ...newTask, estado_tarea: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Fecha de Fin</label>
            <input
              type="date"
              value={newTask.fecha_fin_tarea}
              onChange={(e) => setNewTask({ ...newTask, fecha_fin_tarea: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Asignar a Usuario</label>
            <select
              value={newTask.usuario}
              onChange={(e) => setNewTask({ ...newTask, usuario: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Crear Tarea
          </button>
        </form>
      </div>
      {/* Lista de tareas existentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleTaskClick(task.id)}
          >
            <h2 className="text-xl font-semibold">{task.nombre_tarea}</h2>
            <p className="text-gray-600">{task.descripcion_tarea}</p>
            <p className="text-gray-500">Estado: {task.estado_tarea}</p>
            <p className="text-gray-500">Encargado: {task.usuario.nombre}</p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
export default Tasks;