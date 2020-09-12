export interface ProducType {
  tipo_producto_id: number;
  descripcion: string;
}

export interface ProducQuality {
  calidad_producto_id: number;
  descripcion: string;
}

export interface Product {
  producto_id: number;
  nombre: string;
  variedad: string;
  nombre_cientifico?: string;
  descripcion?: string;
  tipo_producto_id: string;
  vida_util?: string;
  obs_vida_util?: string;
  plu: string;
}

export interface ProducTypeResponse {
  status: string;
  title?: string;
  msg?: string;
  productType?: ProducType[];
}

export interface ProducQualityResponse {
  status: string;
  title?: string;
  msg?: string;
  productQuality?: ProducQuality[];
}

export interface ProductResponse {
  status: string;
  title?: string;
  msg?: string;
  products?: Product[];
}
