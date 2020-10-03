// import { Lot } from '../models/lot.interface';
// Datos de cosecha.
export interface Harvest {
  date: string;
  quality?: string;
  tons: number;
}

export interface CropType {
  tipo_cultivo_id: number;
  descripcion: string;
}

export interface Culture {
  predio_id?: number;
  producto_id: number;
  created_by?: string;
  cosecha: Harvest[];
}

export interface ShowCrops {
  predio_id: string;
  // calidad_producto: string;
  producto_id: string;
  variedad: string;
  // tipo_cultivo: string;
  // edad_cultivo: number;
  // cosechas: Harvest[];
}

export interface CropResponse {
  status: string;
  title?: string;
  msg?: string;
  crops?: ShowCrops[];
}

export interface CropTypeResponse {
  status: string;
  title?: string;
  msg?: string;
  cropType?: CropType[];
}
