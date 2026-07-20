"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, GitGraph } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileMatchGroup } from "@/features/search/file-search-index";
import { SearchMatch } from "@/components/search/search-match";

interface SearchGroupProps {
  group: FileMatchGroup;
  selectedMatchId?: string | null;
  onSelectMatch?: (matchId: string, fileId: string, lineNumber: number) => void;
  onShowDependencies?: (fileName: string) => void;
}

/**
 * Renders a file group with all its matches
 * VSCode-style collapsible group
 */
export function SearchGroup({
  group,
  selectedMatchId,
  onSelectMatch,
  onShowDependencies,
}: SearchGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full border-b border-border">
      {/* File Header */}
      <div className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 transition-colors group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate w-full">
              {group.file.name}
            </p>
            <p className="text-xs text-muted-foreground truncate w-full">
              {group.file.path}
            </p>
          </div>
        </button>

        <div className="flex-shrink-0 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {group.matches.length}{" "}
          {group.matches.length === 1 ? "match" : "matches"}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShowDependencies?.(group.file.name)}
          title="View file dependencies"
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GitGraph className="w-4 h-4" />
        </Button>
      </div>

      {/* Matches */}
      {isExpanded && (
        <div className="w-full bg-muted/20">
          {group.matches.map((match) => (
            <SearchMatch
              key={match.id}
              match={match}
              isSelected={selectedMatchId === match.id}
              onClick={() =>
                onSelectMatch?.(match.id, group.file.id, match.lineNumber)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
