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
  calidad_producto_id: number;
  area_produccion: number;
  area_desarrollo: number;
  ton_hectarea: number;
  venta_estimada: number;
  edad_cultivo: number;
  tipo_cultivo_id: number;
  peso_ultima_cosecha: number;
  predio_exportador: string;
  created_by?: string;
  cosecha: Harvest[];
}

export interface ShowCrops {
  predio: string;
  calidad_producto: string;
  producto: string;
  variedad: string;
  tipo_cultivo: string;
  edad_cultivo: number;
  cosechas: Harvest[];
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
