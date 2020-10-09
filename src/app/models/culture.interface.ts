// import { Lot } from '../models/lot.interface';

import { Pesticide } from './pesticide.interface';

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

// Datos cultivo
export interface CultivationData {
  datos_cultivo_id?: number;
  fecha: string;
  cultivo_id?: number;
  materia_seca?: number;
  asesoria_agronomo: string;
  empresa_abonos: string;
  observacion_emp_abono: string;
  agricultor_organico: string;
  razon_agricultor_org: string;
  fecha_podas: string;
  centro_acopio: string;
  senhaletica: string;
  produce_insumos: string;
  insumos_cuales: string;
  agua: string;
  created_by?: string;
  color?: number;
  pesticide?: Pesticide[];
}
// Respuesta datos cultivo
export interface CultivationDataResponse {
  status: string;
  title?: string;
  msg?: string;
  cultivationData?: CultivationData[];
}

export interface ShowDataTableCrop {
  def: string;
  label: string;
  hide: boolean;
}
