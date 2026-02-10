"use client";

import React, { useMemo } from "react";
import {
  Trophy,
  XCircle,
  TrendingDown,
  Search,
  ChevronRight,
  Target,
} from "lucide-react";

export default function JobRejectionAnalyzer({
  rejectionData = [], // Array of { role: 'Frontend Developer', count: 5 }
}) {
  // Sort data by count descending
  const sortedData = useMemo(() => {
    return [...rejectionData].sort((a, b) => b.count - a.count);
  }, [rejectionData]);

  const maxRejections = sortedData[0]?.count || 1;
  const totalRejections = sortedData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="max-w-2xl w-full bg-white border border-slate-200 round-[2rem] p-8 shadow-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Rejection Analysis
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Total Rejections:{" "}
            <span className="text-rose-600 font-bold">{totalRejections}</span>
          </p>
        </div>
        <div className="h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100">
          <TrendingDown size={28} />
        </div>
      </div>

      {/* Main Insight Card */}
      {sortedData.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
              Top Rejection Pattern
            </p>
            <h3 className="text-xl font-bold">{sortedData[0].role}</h3>
            <p className="text-slate-400 text-sm mt-2">
              You've faced{" "}
              <span className="text-rose-400 font-bold">
                {sortedData[0].count}
              </span>{" "}
              rejections for this specific role. Consider reviewing your
              portfolio for this niche.
            </p>
          </div>
          <Target
            className="absolute -right-4 -bottom-4 text-slate-800"
            size={120}
          />
        </div>
      )}

      {/* Ranked List / Bar Chart */}
      <div className="space-y-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Rejections by Position
        </h4>

        {sortedData.map((item, index) => {
          const percentage = (item.count / maxRejections) * 100;

          return (
            <div key={item.role} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300">
                    0{index + 1}
                  </span>
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {item.role}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {item.count}
                </span>
              </div>

              {/* Custom Progress Bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    index === 0 ? "bg-rose-500" : "bg-slate-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Search size={16} />
          <span>Identify skill gaps</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:gap-2 transition-all">
          View Skills Analysis <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
