"use client";

import React, { useState } from "react";
import {
  GitBranch,
  ExternalLink,
  Terminal,
  CheckCircle2,
  ListOrdered,
  FolderCode,
  AlertCircle,
} from "lucide-react";

export default function CodeIssueAnalyzer({
  issueName = "Memory Leak in Socket.io connection",
  repoName = "mern-realtime-dashboard",
  issueLink = "https://github.com/user/repo/issues/42",
  source = "github", // "github" | "local"
  steps = [
    "Identify connection lifecycle in useEffect hook.",
    "Ensure socket.disconnect() is called in the cleanup function.",
    "Implement a singleton pattern for the socket instance.",
    "Verify heap usage in Chrome DevTools.",
  ],
}) {
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const progress = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header Section */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {source === "github" ? (
              <GitBranch size={14} />
            ) : (
              <FolderCode size={14} />
            )}
            <span className="text-xs font-bold uppercase tracking-widest">
              {source} Issue
            </span>
          </div>
          <a
            href={issueLink}
            target="_blank"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink size={20} />
          </a>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
          {issueName}
        </h2>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
          <Terminal size={14} className="text-emerald-500" />
          <span>repo: {repoName}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5">
        <div
          className="bg-emerald-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Resolution Strategy Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
          <ListOrdered size={18} className="text-indigo-400" />
          <h3>Step-by-Step Resolution</h3>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => toggleStep(index)}
              className={`group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all
                ${
                  completedSteps.includes(index)
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                }`}
            >
              <div
                className={`mt-0.5 shrink-0 rounded-full p-0.5 border-2 transition-colors
                ${
                  completedSteps.includes(index)
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-slate-600 text-transparent"
                }`}
              >
                <CheckCircle2 size={16} />
              </div>
              <p
                className={`text-sm leading-relaxed transition-colors
                ${completedSteps.includes(index) ? "text-slate-400 line-through" : "text-slate-200"}`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <AlertCircle size={14} />
        <span>
          {progress === 100
            ? "Solution Fully Verified"
            : "Resolution in Progress"}
        </span>
      </div>
    </div>
  );
}
