export interface Predio {
  predio_id?: number;
  nombre_predio: string;
  contacto: string;
  representante_legal: string;
  telefono1: string;
  telefono2?: string;
  vereda_id: number;
  correo: string;
  rut: string;
  cuenta: string;
  latitud: number;
  longitud: number;
  observaciones: string;
  created_by: string;
  user_id: number;
}

export interface States {
  predio_id?: number;
  nombre_predio: string;
  representante_legal: string;
}

export interface PredioResponse {
  status: string;
  title?: string;
  msg?: string;
  predio?: {};
  states?: States[];
}
