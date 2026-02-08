"use client";

import React from "react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { cn } from "@/lib/utils";

export interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
  showCanvas?: boolean;
  overlayChildren?: boolean;
}

/**
 * Layout component that provides a chat interface on the left side and canvas space on the right
 * This component assumes it's wrapped in a TamboProvider from the root layout
 */
export function ChatLayout({
  children,
  className,
  showCanvas = true,
  overlayChildren = false,
}: ChatLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      {/* Chat Sidebar */}
      <div className="w-[400px] min-w-[400px] border-r border-border bg-background flex flex-col">
        {/* Chat Header with Theme Toggle */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-card">
          <h2 className="text-sm font-semibold text-foreground">
            Chat Assistant
          </h2>
          <ThemeToggle variant="icon" size="sm" />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          <MessageThreadFull className="h-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("flex-1 relative overflow-hidden", className)}>
        {/* Canvas Space - always rendered when showCanvas is true */}
        {showCanvas && <CanvasSpace className="absolute inset-0 z-0" />}

        {/* Children Content - can be overlaid or replace canvas */}
        {(overlayChildren || !showCanvas) && (
          <div
            className={cn(
              overlayChildren && showCanvas
                ? "absolute inset-0 z-10 bg-background/95 backdrop-blur-sm overflow-auto"
                : "h-full w-full overflow-auto",
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
