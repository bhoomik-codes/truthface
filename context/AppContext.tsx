"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Task, AttendanceRecord, Role } from '../types';

interface AppState {
    currentUser: User | null;
    users: User[];
    tasks: Task[];
    attendance: AttendanceRecord[];

    // Actions
    login: (phone: string, role: Role) => boolean;
    logout: () => void;
    punchIn: (location: { lat: number; lng: number }) => void;
    punchOut: (location: { lat: number; lng: number }) => void;
    updateLocation: (lat: number, lng: number) => void;
    completeTask: (taskId: string, proof: { note: string; photoUrl: string; location: { lat: number; lng: number } }) => void;
    assignTask: (task: Omit<Task, 'id' | 'status'>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Naitik (Admin)', role: 'ADMIN', phone: '9999999999' },
    { id: 'u2', name: 'Rohan (Field)', role: 'EMPLOYEE', phone: '8888888888', details: 'Sales Executive' },
    { id: 'u3', name: 'Amit (Field)', role: 'EMPLOYEE', phone: '7777777777', details: 'Service Engineer' },
];

const MOCK_TASKS: Task[] = [
    {
        id: 't1',
        assignedTo: 'u2',
        title: 'Visit Tech Park Client',
        description: 'Verify server installation requirements.',
        location: { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bangalore' },
        status: 'PENDING',
        dueDate: new Date().toISOString().split('T')[0],
    },
    {
        id: 't2',
        assignedTo: 'u3',
        title: 'Delivery @ Koramangala',
        description: 'Deliver spare parts package.',
        location: { lat: 12.9352, lng: 77.6245, address: 'Koramangala 4th Block' },
        status: 'PENDING',
        dueDate: new Date().toISOString().split('T')[0],
    }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('truthface_db');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setUsers(parsed.users || MOCK_USERS);
            setTasks(parsed.tasks || MOCK_TASKS);
            setAttendance(parsed.attendance || []);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('truthface_db', JSON.stringify({ users, tasks, attendance }));
    }, [users, tasks, attendance]);

    const login = (phone: string, role: Role) => {
        const user = users.find(u => u.phone === phone && u.role === role);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const punchIn = (location: { lat: number; lng: number }) => {
        if (!currentUser) return;
        const today = new Date().toISOString().split('T')[0];

        // Check if already punched in
        const existing = attendance.find(a => a.userId === currentUser.id && a.date === today);
        if (existing) return; // Already exists

        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            userId: currentUser.id,
            date: today,
            punchIn: {
                timestamp: Date.now(),
                location
            },
            status: 'PRESENT'
        };
        setAttendance(prev => [...prev, newRecord]);
    };

    const punchOut = (location: { lat: number; lng: number }) => {
        if (!currentUser) return;
        const today = new Date().toISOString().split('T')[0];

        setAttendance(prev => prev.map(a => {
            if (a.userId === currentUser.id && a.date === today && !a.punchOut) {
                return {
                    ...a,
                    punchOut: {
                        timestamp: Date.now(),
                        location
                    }
                };
            }
            return a;
        }));
    };

    const updateLocation = (lat: number, lng: number) => {
        if (!currentUser) return;
        setUsers(prev => prev.map(u => {
            if (u.id === currentUser.id) {
                return {
                    ...u,
                    lastLocation: { lat, lng, timestamp: Date.now() }
                };
            }
            return u;
        }));
    };

    const completeTask = (taskId: string, proof: { note: string; photoUrl: string; location: { lat: number; lng: number } }) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    status: 'COMPLETED',
                    proof: {
                        ...proof,
                        timestamp: Date.now()
                    }
                };
            }
            return t;
        }));
    };

    const assignTask = (task: Omit<Task, 'id' | 'status'>) => {
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            status: 'PENDING'
        };
        setTasks(prev => [...prev, newTask]);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            users,
            tasks,
            attendance,
            login,
            logout,
            punchIn,
            punchOut,
            updateLocation,
            completeTask,
            assignTask
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};
