"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, AlertCircle, Brain } from "lucide-react";

export default function HabitAnalyzer({
  habitName = "Morning Meditation",
  data = [], // Array of { date: '2026-02-01', completed: 1, reason: '' }
  reasons = [], // Array of all reasons captured for this habit
}) {
  // Logic to find the most frequent reason
  const mostFrequentReason = useMemo(() => {
    if (!reasons.length) return "None yet";
    const counts = reasons.reduce((acc, r) => {
      if (r) acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b,
    );
  }, [reasons]);

  // Calculate completion rate
  const completionRate = useMemo(() => {
    if (!data.length) return 0;
    const done = data.filter((d) => d.completed === 1).length;
    return Math.round((done / data.length) * 100);
  }, [data]);

  return (
    <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {habitName}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-slate-500 font-medium">
            <TrendingUp size={16} className="text-emerald-500" />
            <span>{completionRate}% Consistency</span>
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <Brain className="text-indigo-500" size={24} />
        </div>
      </div>

      {/* Graph Section */}
      <div className="h-48 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[0, 1.2]} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={4}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-rose-500 text-white p-2 rounded-xl">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Main Blocker
            </p>
            <p className="text-slate-700 font-bold italic">
              "{mostFrequentReason}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
