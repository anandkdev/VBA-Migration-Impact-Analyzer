"use client";

import React from "react";
import { SearchMatch as SearchMatchType } from "@/features/search/file-search-index";
import { HighlightText } from "@/components/search/highlight-text";
import { cn } from "@/lib/utils";

interface SearchMatchProps {
  match: SearchMatchType;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Renders a single search match result
 * Shows line number and highlighted match content
 */
export function SearchMatch({
  match,
  isSelected = false,
  onClick,
}: SearchMatchProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-2 border-l-2 hover:bg-accent/20 transition-colors text-wrap",
        isSelected
          ? "border-l-blue-500 bg-blue-500/10"
          : "border-l-transparent",
      )}
      title={`Line ${match.lineNumber}`}
    >
      <div className="flex items-start gap-3">
        {/* Line Number */}
        <div className="flex-shrink-0 font-mono text-xs text-muted-foreground w-12 text-right">
          {match.lineNumber}
        </div>

        {/* Line Content with Highlight */}
        <div className="flex-1 min-w-0 font-mono text-sm break-words whitespace-pre-wrap">
          <HighlightText
            text={match.lineContent}
            matchStart={match.matchStart}
            matchEnd={match.matchEnd}
            className="text-foreground"
          />
        </div>
      </div>
    </button>
  );
}
