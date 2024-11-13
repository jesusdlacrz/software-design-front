import { Proyecto } from './proyecto.type';

export interface Sprint {
    id: number;
    nombre_sprint: string;
    fecha_inicio: string; // Date in ISO format
    fecha_fin: string; // Date in ISO format
    proyecto: Proyecto;
  }