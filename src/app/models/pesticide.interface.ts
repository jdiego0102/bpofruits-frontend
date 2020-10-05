// Datos de plaguicida
export interface Pesticide {
  plaguicida_id?: number;
  cultivo_id?: string;
  descripcion?: string;
  tipo_plaguicida_id?: string;
  nombre_tipo_plaguicida?: string;
  fecha_aplicacion?: string;
  created_by?: string;
}

// Respuesta del plaguicida
export interface PesticideResponse {
  status: string;
  title?: string;
  msg?: string;
  pesticide?: Pesticide[];
}

// Datos de tipo de plaguicida
export interface PesticideType {
  tipo_plaguicida_id?: number;
  descripcion: string;
}

export interface PesticideTypeResponse {
  status: string;
  title?: string;
  msg?: string;
  pesticideType: PesticideType[];
}
