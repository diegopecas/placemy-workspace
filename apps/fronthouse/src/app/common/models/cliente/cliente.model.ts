import { Alergeno } from '../establecimiento/alergeno.model';

export interface Cliente {
  id: number;
  persona_id: number;
  sobrenombre: string | null;
  preferencias_gustos: string | null;
  preferencias_no_gustos: string | null;
  otras_alergias: string | null;
  created_at: string;
  updated_at: string;
  persona?: PersonaNatural;
  alergenos?: Alergeno[];
  fechas_especiales?: ClienteFechaEspecial[];
  establecimientos_count?: number;
}

export interface PersonaNatural {
  id: number;
  tipo_documento_id: number;
  numero_documento: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  fecha_nacimiento: string | null;
  sexo: 'M' | 'F' | 'O' | null;
  telefono: string | null;
  email: string | null;
  nombre_completo: string;
}

export interface ClienteFechaEspecial {
  id: number;
  cliente_id: number;
  tipo_fecha_id: number;
  fecha: string;
  descripcion: string | null;
  tipo_fecha?: TipoFechaEspecial;
}

export interface TipoFechaEspecial {
  id: number;
  nombre: 'CUMPLEAÑOS' | 'ANIVERSARIO' | 'OTRO';
  descripcion: string | null;
}

export interface CreateClienteCompletoDto {
  tipo_documento_id: number;
  numero_documento: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento?: string;
  sexo?: 'M' | 'F' | 'O';
  telefono?: string;
  email?: string;
  sobrenombre?: string;
  preferencias_gustos?: string;
  preferencias_no_gustos?: string;
  otras_alergias?: string;
  alergenos?: number[];
  establecimiento_id?: number;
}

export interface BuscarClienteDto {
  telefono?: string;
  numero_documento?: string;
  nombre?: string;
}

export interface ClienteResponse {
  success: boolean;
  data: Cliente;
  message?: string;
}

export interface ClientesListResponse {
  success: boolean;
  data: Cliente[];
  message?: string;
}