"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitPullRequest,
  Tag,
} from "lucide-react";

export default function IssueTrackerCard({
  issueId = "ISS-101",
  title = "Refactor MongoDB connection logic",
  description = "Connection pool is leaking in development environment. Need to implement a singleton pattern.",
  source = "local", // "github" or "local"
  priority = "high", // "low" | "medium" | "high"
  labels = ["backend", "bug"],
}) {
  const [isOpen, setIsOpen] = useState(true);

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
              {issueId}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${priorityColors[priority]}`}
            >
              {priority}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {source === "github" && (
              <GitPullRequest size={18} className="text-purple-600" />
            )}
            {title}
          </h2>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isOpen
              ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          }`}
        >
          {isOpen ? <Clock size={16} /> : <CheckCircle2 size={16} />}
          {isOpen ? "Open" : "Resolved"}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
            >
              <Tag size={12} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <AlertCircle size={14} />
          <span>Last sync: 2 mins ago</span>
        </div>

        <a
          href="#"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View Details
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
