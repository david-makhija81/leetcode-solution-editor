"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: "default" | "pill";
  className?: string;
  children?: (activeTabId: string) => React.ReactNode;
}

export function Tabs({
  tabs,
  defaultTab,
  onTabChange,
  variant = "default",
  className = "",
  children,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  function handleTabClick(tabId: string) {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }

  return (
    <div className={className}>
      <div
        className={`flex gap-0.5 ${
          variant === "pill"
            ? "bg-bg-base p-1 rounded-lg"
            : "border-b border-border-default"
        }`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-3 py-2 text-sm font-medium transition-colors duration-150 focus-ring
              ${
                variant === "pill"
                  ? activeTab === tab.id
                    ? "bg-bg-elevated text-accent-primary rounded-md"
                    : "text-text-muted hover:text-text-primary rounded-md"
                  : activeTab === tab.id
                    ? "text-accent-primary border-b-2 border-accent-primary -mb-px"
                    : "text-text-muted hover:text-text-primary -mb-px border-b-2 border-transparent"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children && <div className="mt-3">{children(activeTab)}</div>}
    </div>
  );
}
