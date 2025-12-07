"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Role } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();

  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }

    const success = login(phone, role);
    if (success) {
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/app');
      }
    } else {
      setError("Invalid credentials. Try 9999999999 (Admin) or 8888888888 (Employee)");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-[400px]">
        {/* Minimalist Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Truth Face" className="w-16 h-16 mb-6" />
          <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-1">Enter your details to access the workspace.</p>
        </div>

        <div className="clean-panel p-6">
          <div className="flex bg-zinc-900/50 p-1 rounded-lg mb-6 border border-zinc-800">
            <button
              onClick={() => setRole("EMPLOYEE")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === "EMPLOYEE" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              Employee
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === "ADMIN" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9999999999"
                className="clean-input placeholder:text-zinc-700"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-400 text-xs bg-red-500/5 p-2 rounded border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full clean-button mt-2"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-zinc-600 text-xs font-mono">
          Truth Face Inc. &copy; 2025
        </div>
      </div>
    </main>
  );
}
