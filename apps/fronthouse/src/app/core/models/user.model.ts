// src/app/core/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
  persona_natural?: PersonaNatural;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
}

export interface PersonaNatural {
  id: number;
  tipo_documento_id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  nombre_completo?: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono?: string;
  direccion?: string;
  ciudad_id?: number;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: Permission[];
}

export interface Permission {
  id: number;
  nombre: string;
  descripcion?: string;
}
