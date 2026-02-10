"use client";

import * as React from "react";
import { TamboProvider } from "@tambo-ai/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const mcpServers = useMcpServers();

  return (
    <ThemeProvider>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        mcpServers={mcpServers}
      >
        {children}
      </TamboProvider>
    </ThemeProvider>
  );
}
