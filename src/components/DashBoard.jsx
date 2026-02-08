"use client";

import React from "react";
import { LayoutDashboard, Bell, Search, Plus } from "lucide-react";

// Components we built
import JobTrackerCard from "./JobTracker";
import HabitCard from "./Habit";
import IssueTrackerCard from "./CodeIssueTracker";

export default function DevDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* 1. Slim Sidebar */}
      <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-8">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <LayoutDashboard size={24} />
        </div>
        <nav className="flex flex-col gap-6 text-slate-400">
          <Search
            size={22}
            className="hover:text-indigo-600 cursor-pointer transition-colors"
          />
          <Plus
            size={22}
            className="hover:text-indigo-600 cursor-pointer transition-colors"
          />
        </nav>
      </aside>

      {/* 2. Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 flex items-center justify-between px-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              System Overview
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Monday, Feb 9, 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">User Session</p>
              <p className="text-xs text-emerald-500 font-bold">
                Active: 4h 20m
              </p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl" />
          </div>
        </header>

        {/* 3. Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* TOP ROW: Jobs & Habits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT: Job Tracker (7/12) */}
            <section className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Pipeline Status
                </h2>
                <div className="h-px flex-1 bg-slate-200 mx-4" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <JobTrackerCard
                  company="Google"
                  role="L4 Frontend"
                  status="Interview"
                  interviewDate="Feb 10"
                />
                <JobTrackerCard
                  company="Vercel"
                  role="Product Engineer"
                  status="Heard Back"
                />
              </div>
            </section>

            {/* RIGHT: Habit List (5/12) */}
            <section className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Daily Rituals
                </h2>
                <div className="h-px flex-1 bg-slate-200 mx-4" />
              </div>
              <div className="space-y-3">
                <HabitCard habitName="Practice C Syntax" />
                <HabitCard habitName="Leetcode Medium" />
                <HabitCard habitName="FastAPI Docs" />
              </div>
            </section>
          </div>

          {/* BOTTOM ROW: Issue Tracker (Full Width) */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Engineering Issues
              </h2>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
              <button className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4">
                View Git Repo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <IssueTrackerCard
                issueId="BUG-404"
                title="Hydration Error in Navbar"
                priority="high"
                source="local"
              />
              <IssueTrackerCard
                issueId="PR-22"
                title="Integrate MCP Weather Tool"
                priority="medium"
                source="github"
                labels={["python", "mcp"]}
              />
              <IssueTrackerCard
                issueId="TASK-89"
                title="Update MongoDB Schema"
                priority="low"
                source="local"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
