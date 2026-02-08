"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { CanvasLayout } from "@/components/CanvasLayout";
import { components, tools } from "@/lib/tambo";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mcpServers = useMcpServers();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={components}
            tools={tools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
          >
            <CanvasLayout>{children}</CanvasLayout>
          </TamboProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
