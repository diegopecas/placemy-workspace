import { Alergeno } from '../establecimiento/alergeno.model';

/**
 * Cliente - Estructura actualizada
 * Soporta tanto clientes con persona_id como clientes directos
 */
export interface Cliente {
  id: number;
  
  // ========================================
  // CAMPOS DIRECTOS (nueva estructura)
  // ========================================
  nombre?: string | null;
  tipo_documento_id?: number | null;
  numero_documento?: string | null;
  telefono?: string | null;
  email?: string | null;
  sexo?: 'M' | 'F' | 'O' | null;
  dia_cumpleanos?: number | null;
  mes_cumpleanos?: number | null;
  
  // ========================================
  // CAMPOS EXISTENTES
  // ========================================
  persona_id?: number | null;  // Ahora OPCIONAL
  sobrenombre?: string | null;
  preferencias_gustos?: string | null;
  preferencias_no_gustos?: string | null;
  otras_alergias?: string | null;
  created_at: string;
  updated_at: string;
  
  // ========================================
  // RELACIONES
  // ========================================
  persona?: PersonaNatural;  // Solo si tiene persona_id
  alergenos?: Alergeno[];
  fechas_especiales?: ClienteFechaEspecial[];
  establecimientos_count?: number;
}

export interface PersonaNatural {
  id: number;
  tipo_documento_id: number;
  numero_documento: string;
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido: string;
  segundo_apellido?: string | null;
  fecha_nacimiento?: string | null;
  sexo?: 'M' | 'F' | 'O' | null;
  telefono?: string | null;
  email?: string | null;
  nombre_completo: string;
}

export interface ClienteFechaEspecial {
  id: number;
  cliente_id: number;
  tipo_fecha_id: number;
  fecha: string;
  descripcion?: string | null;
  tipo_fecha?: TipoFechaEspecial;
}

export interface TipoFechaEspecial {
  id: number;
  nombre: 'CUMPLEAÑOS' | 'ANIVERSARIO' | 'OTRO';
  descripcion?: string | null;
}

/**
 * DTO para crear cliente COMPLETO (con persona)
 * DEPRECATED: Usar CreateClienteDirectoDto para nuevos clientes
 */
export interface CreateClienteCompletoDto {
  establecimiento_id?: number;
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
}

/**
 * DTO para crear cliente DIRECTO (sin persona)
 * NUEVA estructura - Recomendada
 */
export interface CreateClienteDirectoDto {
  nombre: string;
  telefono: string;
  numero_documento?: string;
  tipo_documento_id?: number;
  email?: string;
  sexo?: 'M' | 'F' | 'O';
  dia_cumpleanos?: number;
  mes_cumpleanos?: number;
  sobrenombre?: string;
  preferencias_gustos?: string;
  preferencias_no_gustos?: string;
  otras_alergias?: string;
  alergenos?: number[];
}

/**
 * DTO para actualizar cliente
 */
export interface UpdateClienteDto {
  nombre?: string;
  telefono?: string;
  numero_documento?: string;
  tipo_documento_id?: number;
  email?: string;
  sexo?: 'M' | 'F' | 'O';
  dia_cumpleanos?: number;
  mes_cumpleanos?: number;
  sobrenombre?: string;
  preferencias_gustos?: string;
  preferencias_no_gustos?: string;
  otras_alergias?: string;
  alergenos?: number[];
}

/**
 * DTO para buscar clientes
 */
export interface BuscarClienteDto {
  telefono?: string;
  numero_documento?: string;
  nombre?: string;
  establecimiento_id?: number;
}

/**
 * Respuestas del API
 */
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

/**
 * Helper para obtener nombre del cliente
 * Prioriza: persona.nombre_completo > nombre directo > sobrenombre
 */
export function getClienteNombre(cliente: Cliente): string {
  if (cliente.persona?.nombre_completo) {
    return cliente.persona.nombre_completo;
  }
  if (cliente.nombre) {
    return cliente.nombre;
  }
  if (cliente.sobrenombre) {
    return cliente.sobrenombre;
  }
  return 'Cliente';
}

/**
 * Helper para obtener teléfono del cliente
 */
export function getClienteTelefono(cliente: Cliente): string | null {
  return cliente.telefono ?? cliente.persona?.telefono ?? null;
}

/**
 * Helper para obtener documento del cliente
 */
export function getClienteDocumento(cliente: Cliente): string | null {
  return cliente.numero_documento ?? cliente.persona?.numero_documento ?? null;
}