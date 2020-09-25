export interface Predio {
  predio_id?: number;
  nombre_predio: string;
  contacto: string;
  tipo_doc_contacto: number;
  nro_doc_contacto: number;
  representante_legal: string;
  tipo_doc_propietario: number;
  nro_doc_propietario: number;
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
  estado_via_acceso: number;
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

// Tipos de documentos
export interface DocumentType {
  tipo_documento_id: number;
  descripcion: string;
}
// Respuestas tipos de documentos
export interface DocumentTypeResponse {
  status: string;
  title?: string;
  msg: string;
  documentType: DocumentType[];
}

// Estados vías de acceso
export interface AccessRoads {
  via_acceso_id: number;
  descripcion: string;
}
// Respuesta estados vías de acceso
export interface AccessRoadsResponse {
  status: string;
  title?: string;
  msg: string;
  accessRoads: AccessRoads[];
}
