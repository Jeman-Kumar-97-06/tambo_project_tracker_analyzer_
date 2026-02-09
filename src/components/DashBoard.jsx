"use client";

import React from "react";
import {
  LayoutDashboard,
  Bell,
  Search,
  Plus,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Components we built
import JobTrackerCard from "./JobTracker";
import HabitCard from "./Habit";
import IssueTrackerCard from "./CodeIssueTracker";

export default function DevDashboard({
  jobs = [],
  habits = [],
  issues = [],
  dateLabel = "Today",
  summary = {
    totalJobs: 0,
    activeHabits: 0,
    openIssues: 0,
    upcomingInterviews: 0,
  },
}) {
  // Format date if it's not already formatted
  const formattedDate =
    dateLabel ||
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Stats for quick overview
  const stats = [
    {
      label: "Active Jobs",
      value: summary.totalJobs,
      icon: <TrendingUp size={16} />,
      color: "text-blue-600",
    },
    {
      label: "Daily Habits",
      value: summary.activeHabits,
      icon: <Calendar size={16} />,
      color: "text-green-600",
    },
    {
      label: "Open Issues",
      value: summary.openIssues,
      icon: <AlertCircle size={16} />,
      color: "text-red-600",
    },
    {
      label: "Interviews",
      value: summary.upcomingInterviews,
      icon: <Bell size={16} />,
      color: "text-purple-600",
    },
  ];

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
              {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">
                Dashboard Stats
              </p>
              <p className="text-xs text-emerald-500 font-bold">
                {summary.totalJobs + summary.activeHabits + summary.openIssues}{" "}
                Total Items
              </p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl" />
          </div>
        </header>

        {/* Quick Stats Row */}
        <div className="px-10 py-6 bg-white border-b border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className={`${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* TOP ROW: Jobs & Habits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT: Job Tracker (7/12) */}
            <section className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Pipeline Status ({jobs.length})
                </h2>
                <div className="h-px flex-1 bg-slate-200 mx-4" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <JobTrackerCard
                      key={index}
                      company={job.company}
                      role={job.role}
                      status={job.status}
                      interviewDate={job.interviewDate}
                      location={job.location}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">
                      No job applications tracked yet
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Add your first job application to get started
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT: Habit List (5/12) */}
            <section className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Daily Rituals ({habits.length})
                </h2>
                <div className="h-px flex-1 bg-slate-200 mx-4" />
              </div>
              <div className="space-y-3">
                {habits.length > 0 ? (
                  habits.map((habit, index) => (
                    <HabitCard
                      key={index}
                      habitName={habit.habitName}
                      initialDate={habit.initialDate}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">
                      No habits tracked yet
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Start tracking your daily habits
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* BOTTOM ROW: Issue Tracker (Full Width) */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Engineering Issues ({issues.length})
              </h2>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
              <button className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4">
                View All Issues
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {issues.length > 0 ? (
                issues.map((issue, index) => (
                  <IssueTrackerCard
                    key={index}
                    issueId={issue.issueId}
                    title={issue.title}
                    description={issue.description}
                    priority={issue.priority}
                    source={issue.source}
                    labels={issue.labels}
                  />
                ))
              ) : (
                <div className="col-span-full p-8 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium">
                    No issues tracked yet
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Track code issues and bugs to stay organized
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
