export type Role = 'ADMIN' | 'EMPLOYEE';

export interface User {
    id: string;
    name: string;
    role: Role;
    phone: string;
    lastLocation?: {
        lat: number;
        lng: number;
        timestamp: number;
    };
    details?: string; // For UI info
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'ON_LEAVE';

export interface AttendanceRecord {
    id: string;
    userId: string;
    date: string; // ISO Date YYYY-MM-DD
    punchIn?: {
        timestamp: number;
        location: { lat: number; lng: number };
    };
    punchOut?: {
        timestamp: number;
        location: { lat: number; lng: number };
    };
    status: AttendanceStatus;
}

export type TaskStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface Task {
    id: string;
    assignedTo: string; // User ID
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: TaskStatus;
    proof?: {
        note?: string;
        photoUrl?: string; // Base64 or mock URL
        timestamp: number;
        location: { lat: number; lng: number };
    };
    dueDate: string; // ISO Date
}
