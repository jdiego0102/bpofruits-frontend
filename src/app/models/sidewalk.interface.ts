export interface Sidewalk {
  vereda_id: number;
  ciudad_id: number;
  nombre_vereda: string;
}

export interface SidewalkResponse {
  status: string;
  title?: string;
  msg: string;
}
