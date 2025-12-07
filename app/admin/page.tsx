"use client";

import { useAppContext } from "@/context/AppContext";
import { User, Task } from "@/types";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Plus, Users, Map as MapIcon, LogOut, Grid, List } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamic import for Leaflet map (No SSR)
const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 text-sm font-mono">INITIALIZING MAP SATELLITE...</div>
});

export default function AdminDashboard() {
    const { users, tasks, attendance, assignTask, currentUser, logout } = useAppContext();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'MAP' | 'TASKS'>('MAP');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', description: '', address: '' });
    const [taskAssignee, setTaskAssignee] = useState<string>("");

    if (currentUser?.role !== 'ADMIN') {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const employees = users.filter(u => u.role === 'EMPLOYEE');
    const stats = {
        total: employees.length,
        active: attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && !a.punchOut).length,
        tasksDone: tasks.filter(t => t.status === 'COMPLETED').length
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskAssignee || !newTask.title) return;

        assignTask({
            assignedTo: taskAssignee,
            title: newTask.title || "New Task",
            description: newTask.description || "",
            location: {
                lat: 12.9 + (Math.random() * 0.1),
                lng: 77.5 + (Math.random() * 0.1),
                address: (newTask as any).address || "Bangalore"
            },
            dueDate: new Date().toISOString().split('T')[0]
        });
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', address: '' });
    };

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans">
            {/* Sidebar - Clean & Solid */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col z-20">
                <div className="p-6 h-16 flex items-center gap-3 border-b border-zinc-800">
                    <img src="/logo.png" className="w-6 h-6 object-contain" />
                    <span className="font-semibold text-white tracking-tight">Truth Face</span>
                </div>

                <div className="p-4 space-y-4">
                    <div className="clean-panel p-4 bg-zinc-900/50">
                        <div className="text-sm text-zinc-400 mb-1">Online Staff</div>
                        <div className="text-2xl font-semibold text-white">{stats.active} <span className="text-zinc-600 text-lg">/ {stats.total}</span></div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-2">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 mt-4">Field Team</div>
                    {employees.map(emp => {
                        const isOnline = attendance.some(a => a.userId === emp.id && a.date === new Date().toISOString().split('T')[0] && !a.punchOut);
                        return (
                            <div key={emp.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-white group mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                <span className="text-sm font-medium">{emp.name}</span>
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <button onClick={logout} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors px-2">
                        <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative bg-zinc-950">
                {/* Toolbar - Minimalist */}
                <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 z-10 w-full">
                    <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('MAP')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'MAP' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <MapIcon className="w-3 h-3" /> Live Map
                        </button>
                        <button
                            onClick={() => setActiveTab('TASKS')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'TASKS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <List className="w-3 h-3" /> Tasks
                        </button>
                    </div>

                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="clean-button flex items-center gap-2 text-xs"
                    >
                        <Plus className="w-3 h-3" /> Create Assignment
                    </button>
                </div>

                <div className="flex-1 relative">
                    {/* Map Layer */}
                    <div className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'MAP' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Map users={employees} />
                    </div>

                    {/* Tasks Layer */}
                    <div className={`absolute inset-0 overflow-y-auto p-8 transition-opacity duration-200 ${activeTab === 'TASKS' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <div className="clean-panel overflow-hidden">
                            <table className="clean-table">
                                <thead>
                                    <tr className="bg-zinc-900/50">
                                        <th>Title</th>
                                        <th>Assignee</th>
                                        <th>Status</th>
                                        <th>Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => {
                                        const assignee = users.find(u => u.id === task.assignedTo);
                                        return (
                                            <tr key={task.id} className="hover:bg-zinc-900/30">
                                                <td className="text-zinc-200 font-medium">{task.title}</td>
                                                <td className="text-zinc-400">{assignee?.name || 'Unknown'}</td>
                                                <td>
                                                    <span className={`badge ${task.status === 'COMPLETED' ? 'badge-green' : 'badge-yellow'}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="text-zinc-500 text-xs font-mono">
                                                    {task.proof?.note || '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Task Modal - Clean */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="clean-panel w-full max-w-lg p-6 bg-zinc-950">
                        <h2 className="text-lg font-semibold text-white mb-6">Assign New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">TASK TITLE</label>
                                <input
                                    className="clean-input"
                                    placeholder="e.g. Visit Client X"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">DESCRIPTION</label>
                                <textarea
                                    className="clean-input resize-none h-24"
                                    placeholder="Details about the task..."
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">LOCATION</label>
                                <input
                                    className="clean-input"
                                    placeholder="e.g. MG Road"
                                    value={(newTask as any).address || ''}
                                    onChange={e => setNewTask({ ...newTask, address: e.target.value } as any)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">ASSIGN TO</label>
                                <select
                                    className="clean-input appearance-none bg-black"
                                    value={taskAssignee}
                                    onChange={e => setTaskAssignee(e.target.value)}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.details})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="clean-button-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="clean-button"
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
