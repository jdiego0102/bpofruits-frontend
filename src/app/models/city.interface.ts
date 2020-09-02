export interface City {
  ciudad_id: number;
  nombre_ciudad: string;
  departamento_id: number;
}

export interface CityResponse {
  status: string;
  title?: string;
  msg: string;
  cities: [];
}
