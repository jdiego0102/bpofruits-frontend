// Datos de cosecha.
export interface HarvestData {
  date: string;
  quality: string;
  tons: number;
}

export interface CropType {
  tipo_cultivo_id: number;
  descripcion: string;
}

export interface Culture {
  predio_id: number;
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
}

export interface CropTypeResponse {
  status: string;
  title?: string;
  msg?: string;
  cropType?: CropType[];
}
