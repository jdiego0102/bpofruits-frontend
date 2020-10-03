import { Harvest } from '../models/culture.interface';

export interface Lot {
  cultivo_id?: number;
  calidad_producto_id: number;
  area_produccion: number;
  area_desarrollo: number;
  ton_hectarea: number;
  venta_estimada: number;
  edad_lote: number;
  tipo_cultivo_id: number;
  peso_ultima_cosecha: number;
  predio_exportador: string;
  created_by: string;
  cosecha: Harvest[];
}

export interface LotResponse {
  status: string;
  title?: string;
  msg?: string;
  lot?: Lot[];
}
