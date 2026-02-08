import { User } from './auth';

export interface Role {
    id: number;
    name: string;
    description?: string;
}

export interface ResourceType {
    id: number;
    nombre: string;
    descripcion: string;
    estado: number;
    created_at?: string;
    updated_at?: string;
}

export interface Resource {
    id: number;
    tipo_recurso_id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    capacidad: number;
    planta?: number; // Added planta
    disponibilidad_general: boolean;
    estado: number;
    tipo_recurso?: ResourceType;
    reservas_count?: number; // For stats
}

export interface Reservation {
    id: number;
    user_id: number;
    recurso_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string; // 'activa', 'cancelada'
    comentarios: string;
    user?: User;
    recurso?: Resource;
    created_at?: string;
    updated_at?: string;
}

export interface CreateReservationData {
    recurso_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    comentarios?: string;
}

export interface UpdateReservationData {
    fecha_inicio?: string;
    fecha_fin?: string;
    comentarios?: string;
    estado?: string; // Admin only
    recurso_id?: number; // Admin only
}

export interface ResourceFilters {
    tipo_recurso_id?: number;
    disponible?: boolean;
    capacidad?: number;
    ubicacion?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}

export interface Notification {
    id: number;
    user_id: number;
    tipo: string;
    titulo: string;
    mensaje: string;
    leida: boolean;
    created_at: string;
    updated_at?: string;
}

export interface HistoryLog {
    id: number;
    reserva_id: number;
    user_id: number;
    accion: string;
    detalle: string;
    created_at: string;
    user?: User;
}

export interface SystemStats {
    periodo: {
        desde: string;
        hasta: string;
    };
    totales: {
        total_reservas: number;
        reservas_activas: number;
        reservas_canceladas: number;
    };
    promedios: {
        reservas_por_usuario: number;
        reservas_por_recurso: number;
    };
    top_usuarios: {
        usuario: string;
        total_reservas: number;
    }[];
    reservas_por_tipo_recurso: {
        tipo: string;
        total_reservas: number;
    }[];
}
