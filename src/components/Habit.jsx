"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Calendar,
  MessageSquare,
  CornerDownRight,
} from "lucide-react";

export default function HabitCard({
  habitName = "New Habit",
  initialDate = new Date().toLocaleDateString(),
}) {
  const [status, setStatus] = useState("pending"); // 'done' | 'missed' | 'pending'
  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);

  const handleDone = () => {
    setStatus("done");
    setShowReasonInput(false);
    setReason(""); // Clear reason if they switch to Done
  };

  const handleNotDone = () => {
    setStatus("missed");
    setShowReasonInput(true);
  };

  return (
    <div className="max-w-md w-full flex flex-col gap-2">
      <div
        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm
        ${
          status === "done"
            ? "bg-emerald-50 border-emerald-500"
            : status === "missed"
              ? "bg-rose-50 border-rose-500"
              : "bg-white border-slate-100"
        }`}
      >
        <div className="space-y-1">
          <h3
            className={`font-semibold text-lg ${status === "done" ? "text-emerald-800" : status === "missed" ? "text-rose-800" : "text-slate-800"}`}
          >
            {habitName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} className="opacity-70" />
            <span>{initialDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNotDone}
            className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all active:scale-95
              ${status === "missed" ? "bg-rose-500 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-rose-100"}`}
          >
            <X size={22} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleDone}
            className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all active:scale-95
              ${status === "done" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-emerald-100"}`}
          >
            <Check size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Conditional Reason Input */}
      {showReasonInput && (
        <div className="flex items-start gap-2 ml-4 animate-in slide-in-from-top-2 duration-300">
          <CornerDownRight className="text-slate-300 mt-2" size={20} />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Why was it missed? (e.g. Too tired, Work)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 pl-10 text-sm border-2 border-rose-200 rounded-xl focus:border-rose-400 focus:outline-none bg-white text-slate-700 shadow-inner"
              autoFocus
            />
            <MessageSquare
              className="absolute left-3 top-3.5 text-rose-300"
              size={16}
            />
          </div>
        </div>
      )}
    </div>
  );
}
