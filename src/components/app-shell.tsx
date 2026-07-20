"use client";

import React from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "@/components/sidebar";
import { Toolbar } from "@/components/toolbar";
import { MainViewer } from "@/components/main-viewer";
import { useProjectStore } from "@/store/project-store";

export function AppShell() {
  const { activeSection, setActiveSection } = useProjectStore();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Toolbar */}
      <Toolbar activeSection={activeSection} />

      {/* Main Content with Resizable Panels */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar */}
          <Panel
            defaultSize={12}
            minSize={12}
            maxSize={30}
            className="border-r border-border"
          >
            <Sidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Main Viewer */}
          <Panel defaultSize={55} minSize={40}>
            <MainViewer activeSection={activeSection} />
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Right Inspector Panel */}
          {/* <Panel defaultSize={30} minSize={15} maxSize={50} className="border-l border-border">
            <Inspector activeSection={activeSection} />
          </Panel> */}
        </PanelGroup>
      </div>
    </div>
  );
}
