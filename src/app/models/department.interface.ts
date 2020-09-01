export interface Department {
  departamento_id: number;
  nombre_departamento: string;
}

export interface DepartmentResponse {
  status: string;
  title?: string;
  msg: string;
  departments: [];
}
