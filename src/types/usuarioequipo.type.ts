import { Usuario } from './usuario.type';
import { EquipoTrabajo } from './equipotrabajo.type';

export interface UsuarioEquipo {
    usuario_equipo_id: number;
    fecha_union: string; // Date in ISO format
    rol_equipo: string;
    usuario: Usuario;
    equipo_trabajo: EquipoTrabajo;
    es_creador: boolean;
  }