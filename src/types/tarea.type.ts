import { Sprint } from './sprint.type';
import { Usuario } from './usuario.type';

export interface Tarea {
    id: number;
    nombre_tarea: string;
    descripcion_tarea: string;
    fecha_inicio_tarea: string; // Date in ISO format
    fecha_fin_tarea: string; // Date in ISO format
    estado_tarea: string;
    sprint: Sprint;
    usuario: Usuario;
  }