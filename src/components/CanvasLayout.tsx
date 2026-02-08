"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChatLayout } from "@/components/ChatLayout";

export interface CanvasLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that manages canvas visibility based on the current route
 * and provides consistent chat sidebar + canvas space layout across the app
 */
export function CanvasLayout({ children }: CanvasLayoutProps) {
  const pathname = usePathname();

  // Routes that should NOT show the canvas (chat-only pages)
  const noCanvasRoutes = ["/chat"];

  // Routes that should overlay content on top of canvas
  const overlayRoutes = ["/interactables"];

  // Show canvas by default unless explicitly excluded
  const showCanvas = !noCanvasRoutes.includes(pathname);
  const overlayChildren = overlayRoutes.includes(pathname);

  return (
    <ChatLayout showCanvas={showCanvas} overlayChildren={overlayChildren}>
      {children}
    </ChatLayout>
  );
}
