export interface Actor {
  id?: number;
  nombres: string;
  apellidos: string;
  nro_documento: number;
  updated_by: string;
}

export interface ActorResponse {
  status: string;
  title?: string;
  msg: string;
  actor?: {};
}
