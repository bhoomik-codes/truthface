"use client";

import { useAppContext } from "@/context/AppContext";
import { Task } from "@/types";
import { CheckCircle, Clock, MapPin, Navigation, Camera, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TasksPage() {
    const { tasks, currentUser, completeTask } = useAppContext();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter tasks for current user
    const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id);
    const pendingTasks = myTasks.filter(t => t.status === 'PENDING');
    const completedTasks = myTasks.filter(t => t.status === 'COMPLETED');

    const handleComplete = () => {
        if (!selectedTask) return;
        setIsSubmitting(true);

        // Simulate upload delay
        setTimeout(() => {
            completeTask(selectedTask.id, {
                note: note || "Task completed",
                photoUrl: "https://via.placeholder.com/300?text=Proof+Photo", // Simulator
                location: { lat: 12.9716, lng: 77.5946 } // Simulator
            });
            setIsSubmitting(false);
            setSelectedTask(null);
            setNote("");
        }, 1000);
    };

    return (
        <div className="p-6 pb-24 space-y-6">
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>

            {/* Pending List */}
            <section>
                <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Pending ({pendingTasks.length})</h2>
                <div className="space-y-4">
                    {pendingTasks.map(task => (
                        <motion.div
                            layoutId={task.id}
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="glass-panel p-4 rounded-xl active:scale-95 transition-transform"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white">{task.title}</h3>
                                <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-1 rounded-full">{task.status}</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin className="w-3 h-3" />
                                {task.location.address}
                            </div>
                        </motion.div>
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className="text-center py-8 text-slate-600 italic">No pending tasks today.</div>
                    )}
                </div>
            </section>

            {/* Completed List */}
            <section>
                <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Completed ({completedTasks.length})</h2>
                <div className="space-y-4 opacity-60">
                    {completedTasks.map(task => (
                        <div key={task.id} className="glass-panel p-4 rounded-xl border-green-500/20">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-300 line-through">{task.title}</h3>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-slate-500 text-sm">Completed at {new Date(task.proof?.timestamp || 0).toLocaleTimeString()}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Task Details Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTask(null)}
                            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={selectedTask.id}
                            className="fixed inset-x-4 bottom-4 top-20 bg-slate-900 border border-slate-700 rounded-3xl z-[70] p-6 flex flex-col overflow-y-auto"
                        >
                            <div className="flex-1">
                                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedTask.title}</h2>
                                <div className="flex items-start gap-2 text-slate-400 mb-6">
                                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-white">{selectedTask.location.address}</p>
                                        <button className="text-blue-400 text-xs mt-1 font-medium flex items-center gap-1">
                                            <Navigation className="w-3 h-3" /> Navigate
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl mb-6">
                                    <h4 className="text-xs uppercase text-slate-500 mb-1">Instructions</h4>
                                    <p className="text-slate-300">{selectedTask.description}</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        <Camera className="w-5 h-5" /> Proof of Work
                                    </h3>

                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note about the visit..."
                                        className="glass-input w-full min-h-[100px] resize-none"
                                    />

                                    <button className="w-full h-32 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-400 transition-colors">
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Tap to take photo</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800">
                                <button
                                    onClick={handleComplete}
                                    disabled={isSubmitting}
                                    className="w-full glass-button bg-green-600 hover:bg-green-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Mark Complete'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
