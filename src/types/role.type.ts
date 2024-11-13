import { EquipoTrabajo } from './equipotrabajo.type';

export interface Roles {
    id: number;
    nombre_rol: string;
    descripcion_rol: string;
    equipo_trabajo: EquipoTrabajo;
  }