import { EquipoTrabajo } from './equipotrabajo.type';

export interface Proyecto {
    id: number;
    nombre_proyecto: string;
    descripcion_proyecto: string;
    fecha_inicio_proyecto: string; // Date in ISO format
    fecha_fin_proyecto: string; // Date in ISO format
    estado_proyecto: string;
    equipo_trabajo: EquipoTrabajo;
}
