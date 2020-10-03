// import { Lot } from '../models/lot.interface';
// Datos de cosecha.
export interface Harvest {
  date: string;
  quality?: string;
  tons: number;
}

// Tipos de cultivo
export interface CropType {
  tipo_cultivo_id: number;
  descripcion: string;
}
// Datos del cultivo
export interface Culture {
  predio_id?: number;
  producto_id: number;
  created_by?: string;
  cosecha: Harvest[];
}
// Datos del cultivo para mostrar en tabla
export interface ShowCrops {
  cultivo_id?: number;
  predio_id: string;
  producto?: string;
  variedad: string;
}
// Respuesta del cultivo
export interface CropResponse {
  status: string;
  title?: string;
  msg?: string;
  crops?: ShowCrops[];
}
// Respuesta tipo cultivo.
export interface CropTypeResponse {
  status: string;
  title?: string;
  msg?: string;
  cropType?: CropType[];
}
