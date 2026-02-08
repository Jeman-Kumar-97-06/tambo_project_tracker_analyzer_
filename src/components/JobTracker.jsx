"use client";

import React from "react";
import {
  Briefcase,
  Clock,
  XCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function JobTrackerCard({
  company = "Google",
  role = "Frontend Developer",
  status = "Interview", // "Applied" | "Waiting" | "Rejected" | "Heard Back" | "Interview"
  interviewDate = "Feb 10",
  location = "Remote",
}) {
  // Configuration for different status states
  const statusConfig = {
    Applied: {
      color: "blue",
      icon: <Briefcase size={18} />,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    Waiting: {
      color: "slate",
      icon: <Clock size={18} />,
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-600",
    },
    Rejected: {
      color: "red",
      icon: <XCircle size={18} />,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
    },
    "Heard Back": {
      color: "purple",
      icon: <CheckCircle2 size={18} />,
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
    Interview: {
      color: "amber",
      icon: <Calendar size={18} />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
  };

  const current = statusConfig[status] || statusConfig["Waiting"];

  return (
    <div
      className={`max-w-md w-full border-2 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${current.border} ${current.bg}`}
    >
      <div className="p-5">
        {/* Header: Company & Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-white border ${current.border} ${current.text}`}
            >
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">
                {company}
              </h3>
              <p className="text-sm text-slate-500">{location}</p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-white ${current.border} ${current.text}`}
          >
            {current.icon}
            {status}
          </span>
        </div>

        {/* Role Title */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Position
          </p>
          <h2 className="text-xl font-extrabold text-slate-800">{role}</h2>
        </div>

        {/* Dynamic Detail: Interview Date or Status Note */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white">
          <div className="flex items-center gap-2">
            {status === "Interview" ? (
              <>
                <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-600">
                    Interview Date
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {interviewDate}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                <Clock size={14} />
                <span>Updated recently</span>
              </div>
            )}
          </div>

          <button
            className={`p-2 rounded-lg transition-colors bg-white border hover:shadow-md ${current.border} ${current.text}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
