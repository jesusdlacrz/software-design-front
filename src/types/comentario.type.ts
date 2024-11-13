import { Tarea } from './tarea.type';
import { Usuario } from './usuario.type';

export interface Comentario {
    id: number;
    contenido_comentario: string;
    fecha_comentario: string; // Date in ISO format
    tarea: Tarea;
    usuario: Usuario;
  }