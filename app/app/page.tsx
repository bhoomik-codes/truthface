"use client";

import { useAppContext } from "@/context/AppContext";
import { useGeoLocation } from "@/context/useGeoLocation";
import { MapPin, CheckCircle, Clock, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployeeHome() {
    const { currentUser, attendance, punchIn, punchOut } = useAppContext();
    const { location, refreshLocation } = useGeoLocation();
    const [status, setStatus] = useState<'IDLE' | 'PUNCHED_IN' | 'COMPLETED'>('IDLE');

    const today = new Date().toISOString().split('T')[0];
    const todaysRecord = attendance.find(a => a.userId === currentUser?.id && a.date === today);

    useEffect(() => {
        if (todaysRecord) {
            if (todaysRecord.punchOut) {
                setStatus('COMPLETED');
            } else {
                setStatus('PUNCHED_IN');
            }
        } else {
            setStatus('IDLE');
        }
    }, [todaysRecord]);

    const handleAction = () => {
        refreshLocation();
        setTimeout(() => {
            const loc = location || { lat: 12.9716, lng: 77.5946 };
            if (status === 'IDLE') punchIn(loc);
            else if (status === 'PUNCHED_IN') punchOut(loc);
        }, 800);
    };

    if (!currentUser) return null;

    return (
        <div className="p-6 max-w-lg mx-auto pb-32">
            {/* Header */}
            <header className="flex justify-between items-start mb-10 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Hello, {currentUser.name.split(' ')[0]}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-zinc-500 text-xs font-mono">
                        <div className={`w-1.5 h-1.5 rounded-full ${location ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {location ? "GPS LOCKED" : "SEARCHING GPS..."}
                    </div>
                </div>
                <img src="/logo.png" className="w-10 h-10 object-contain opacity-80" alt="Logo" />
            </header>

            {/* Main Action - Clean & sharp */}
            <div className="clean-panel p-8 mb-8 text-center flex flex-col items-center justify-center min-h-[300px]">

                <button
                    onClick={handleAction}
                    disabled={status === 'COMPLETED'}
                    className={`
                w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-200 mb-6
                ${status === 'IDLE' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : ''}
                ${status === 'PUNCHED_IN' ? 'bg-zinc-800 border border-zinc-700 text-red-500 hover:bg-zinc-700 hover:text-red-400' : ''}
                ${status === 'COMPLETED' ? 'bg-emerald-900/20 border border-emerald-900/50 text-emerald-500 cursor-not-allowed' : ''}
             `}
                >
                    {status === 'IDLE' && <Play className="w-12 h-12 fill-current" />}
                    {status === 'PUNCHED_IN' && <Square className="w-12 h-12 fill-current" />}
                    {status === 'COMPLETED' && <CheckCircle className="w-12 h-12" />}
                </button>

                <div className="space-y-1">
                    <h2 className="text-2xl font-medium text-white">
                        {status === 'IDLE' && "Start Day"}
                        {status === 'PUNCHED_IN' && "On Duty"}
                        {status === 'COMPLETED' && "Shift Done"}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {status === 'IDLE' && "Record your entry time."}
                        {status === 'PUNCHED_IN' && "Tracking visit locations."}
                        {status === 'COMPLETED' && "Syncing data to admin."}
                    </p>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="clean-panel p-4">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Entry Time</span>
                    <span className="text-lg font-mono text-zinc-200">
                        {todaysRecord?.punchIn ? new Date(todaysRecord.punchIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                </div>
                <div className="clean-panel p-4">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Hours</span>
                    <span className="text-lg font-mono text-zinc-200">
                        {todaysRecord?.punchOut && todaysRecord?.punchIn
                            ? `${((todaysRecord.punchOut.timestamp - todaysRecord.punchIn.timestamp) / 1000 / 60 / 60).toFixed(1)}h`
                            : '--'}
                    </span>
                </div>
            </div>
        </div>
    );
}
