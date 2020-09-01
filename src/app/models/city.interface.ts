export interface City {
  ciudad_id: number;
  departamento_id: number;
  nombre_ciudad: string;
}

export interface DepartamentResponse {
  status: string;
  title?: string;
  msg: string;
}
