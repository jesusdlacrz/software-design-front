import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: 'No iniciado' | 'En proceso' | 'Terminada';
  comments: string[];
}

const Tasks = () => {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();

  // datos de relleno
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Tarea 1',
      assignee: 'Juan Pérez',
      status: 'No iniciado',
      comments: ['Comentario inicial'],
    },
    {
      id: 2,
      title: 'Tarea 2',
      assignee: 'María García',
      status: 'En proceso',
      comments: [],
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = (status: Task['status']) => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status });
      setTasks(tasks.map(t => (t.id === selectedTask.id ? { ...t, status } : t)));
    }
  };

  const handleAddComment = () => {
    if (selectedTask && newComment) {
      const updatedTask = {
        ...selectedTask,
        comments: [...selectedTask.comments, newComment],
      };
      setSelectedTask(updatedTask);
      setTasks(tasks.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">
        Tareas del Sprint {sprintId} en el Proyecto {projectId}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleTaskClick(task)}
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>Encargado: {task.assignee}</p>
            <p>Estado: {task.status}</p>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
          <p><strong>Encargado:</strong> {selectedTask.assignee}</p>
          <p>
            <strong>Estado:</strong> {selectedTask.status}
          </p>
          <div className="mt-2">
            <label className="font-semibold mr-2">Cambiar Estado:</label>
            <select
              value={selectedTask.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className="border rounded px-2 py-1"
            >
              <option value="No iniciado">No iniciado</option>
              <option value="En proceso">En proceso</option>
              <option value="Terminada">Terminada</option>
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Comentarios:</h3>
            <ul className="list-disc ml-5 mb-2">
              {selectedTask.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Agregar comentario"
              className="border rounded px-2 py-1 mr-2"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
