export interface Predio {
  predio_id?: number;
  nombre_predio: string;
  contacto: string;
  representante_legal: string;
  telefono1: string;
  telefono2?: string;
  vereda_id: string;
  correo: string;
  rut: string;
  cuenta: string;
  latitud: string;
  longitud: string;
  observaciones: string;
  updated_by: string;
  user_id: number;
}

export interface PredioResponse {
  status: string;
  title?: string;
  msg: string;
}
