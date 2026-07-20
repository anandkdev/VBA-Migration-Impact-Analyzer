"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHeader } from "@/components/search/search-header";
import { SearchToolbar } from "@/components/search/search-toolbar";
import { SearchGroup } from "@/components/search/search-group";
import { SearchPreview } from "@/components/search/search-preview";
import { FileDependencyPanel } from "@/components/search/file-dependency-panel";
import { SearchResultSkeleton } from "@/components/loaders/skeleton-loader";
import { useProjectStore } from "@/store/project-store";
import { fileSearchService } from "@/features/search/file-search-service";
import {
  SearchOptions,
  FileMatchGroup,
} from "@/features/search/file-search-index";

/**
 * VSCode-style full-text file search
 * Implements clean architecture:
 * - Search logic in file-search-service.ts
 * - Indexing in file-search-index.ts
 * - UI components are dumb and reusable
 * - Navigation via global store
 */
export function FileSearchView() {
  const {
    files,
    activeSearchTerm,
    activeSearchResultId,
    setActiveSearch,
    setActiveFile,
  } = useProjectStore();

  const [query, setQuery] = useState(activeSearchTerm || "");
  const [showOptions, setShowOptions] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplacing, setIsReplacing] = useState(false);
  const [results, setResults] = useState<FileMatchGroup[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [lastReplacedIndex, setLastReplacedIndex] = useState(0);
  const [showDependencyPanel, setShowDependencyPanel] = useState(false);
  const [dependencyFileName, setDependencyFileName] = useState<string | null>(
    null,
  );

  const [searchOptions, setSearchOptions] = useState<Partial<SearchOptions>>({
    caseSensitive: false,
    wholeWord: false,
    matchRegex: false,
    ignoreComments: true,
  });

  // Initialize search index when files change
  useEffect(() => {
    setIsInitializing(true);
    if (files.length > 0) {
      // Simulate async initialization
      setTimeout(() => {
        fileSearchService.initializeIndex(files);
        setIsInitializing(false);
      }, 100);
    } else {
      setIsInitializing(false);
    }
  }, [files]);

  // Perform search when query or options change
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const searchResults = await fileSearchService.searchDebounced(
        query,
        searchOptions,
      );
      setResults(searchResults);
      setIsSearching(false);
    };

    performSearch();
  }, [query, searchOptions]);

  // Update global search term
  useEffect(() => {
    setActiveSearch(query || null);
  }, [query, setActiveSearch]);

  // Calculate total match count
  const matchCount = useMemo(
    () => fileSearchService.getMatchCount(results),
    [results],
  );

  // Handle match selection - show preview instead of navigating
  const handleSelectMatch = (
    matchId: string,
    fileId: string,
    lineNumber: number,
  ) => {
    setSelectedFileId(fileId);
    setSelectedMatchId(matchId);
    setActiveFile(fileId, lineNumber);
  };

  // Handle close preview
  const handleClosePreview = () => {
    setSelectedFileId(null);
    setSelectedMatchId(null);
  };

  // Handle showing dependency panel
  const handleShowDependencies = (fileName: string) => {
    setDependencyFileName(fileName);
    setShowDependencyPanel(true);
  };

  // Handle close dependency panel
  const handleCloseDependencyPanel = () => {
    setShowDependencyPanel(false);
    setDependencyFileName(null);
  };

  // Handle replace next match
  const handleReplace = async () => {
    if (!query || !selectedMatchId || !selectedFileId) return;

    setIsReplacing(true);
    try {
      const fileGroup = results.find((g) => g.file.id === selectedFileId);
      if (!fileGroup) return;

      const match = fileGroup.matches.find((m) => m.id === selectedMatchId);
      if (!match) return;

      const result = fileSearchService.replaceMatch(
        selectedFileId,
        match.lineNumber,
        match.matchStart,
        match.matchEnd,
        replaceValue,
      );

      if (result.success) {
        // Update file in store
        const updatedContent = fileSearchService.getFileContent(selectedFileId);
        if (updatedContent) {
          // Clear and rebuild index to get updated results
          fileSearchService.clearIndex();
          fileSearchService.initializeIndex(
            files.map((f) =>
              f.id === selectedFileId ? { ...f, content: updatedContent } : f,
            ),
          );

          // Re-search to update results
          const newResults = await fileSearchService.searchDebounced(
            query,
            searchOptions,
          );
          setResults(newResults);

          // Move to next match
          const nextIndex = lastReplacedIndex + 1;
          if (nextIndex < newResults.length) {
            setLastReplacedIndex(nextIndex);
          }
        }
      }
    } finally {
      setIsReplacing(false);
    }
  };

  // Handle replace all matches
  const handleReplaceAll = async () => {
    if (!query) return;

    setIsReplacing(true);
    try {
      const replacementResult = fileSearchService.replaceAllMatches(
        results,
        replaceValue,
      );

      if (replacementResult.success) {
        // Get updated content for all affected files
        const updatedFiles = files.map((file) => {
          const updatedContent = fileSearchService.getFileContent(file.id);
          return updatedContent ? { ...file, content: updatedContent } : file;
        });

        // Clear and rebuild index
        fileSearchService.clearIndex();
        fileSearchService.initializeIndex(updatedFiles);

        // Re-search to get updated results
        const newResults = await fileSearchService.searchDebounced(
          query,
          searchOptions,
        );
        setResults(newResults);

        // Show success message
        console.log(`Replaced ${replacementResult.totalReplaced} matches`);
      }
    } finally {
      setIsReplacing(false);
    }
  };

  // Get selected file group for preview
  const selectedFileGroup = useMemo(() => {
    if (!selectedFileId) return null;
    return results.find((group) => group.file.id === selectedFileId) || null;
  }, [results, selectedFileId]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        matchCount={matchCount}
        results={results}
        isLoading={isSearching || isInitializing}
        onToggleOptions={() => setShowOptions(!showOptions)}
        showOptions={showOptions}
        replaceValue={replaceValue}
        onReplaceChange={setReplaceValue}
        showReplace={showReplace}
        onToggleReplace={() => setShowReplace(!showReplace)}
        onReplace={handleReplace}
        onReplaceAll={handleReplaceAll}
        isReplacing={isReplacing}
      />

      {/* Options */}
      {showOptions && (
        <SearchToolbar
          options={searchOptions}
          onOptionsChange={setSearchOptions}
        />
      )}

      {/* Results with Preview */}
      <div className="flex-1 overflow-hidden">
        {!query.trim() ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm mb-2">Start typing to search</p>
              <p className="text-xs">Search across all imported files</p>
            </div>
          </div>
        ) : isSearching || isInitializing ? (
          <ScrollArea className="h-full">
            <SearchResultSkeleton />
          </ScrollArea>
        ) : results.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm mb-1">No matches found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          </div>
        ) : selectedFileId || showDependencyPanel ? (
          <PanelGroup direction="horizontal">
            {/* Results Panel */}
            <Panel defaultSize={40} minSize={30}>
              <ScrollArea className="h-full">
                <div>
                  {results.map((group) => (
                    <SearchGroup
                      key={group.file.id}
                      group={group}
                      selectedMatchId={selectedMatchId}
                      onSelectMatch={handleSelectMatch}
                      onShowDependencies={handleShowDependencies}
                    />
                  ))}
                </div>
              </ScrollArea>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

            {/* Preview or Dependency Panel */}
            {showDependencyPanel ? (
              <Panel defaultSize={60} minSize={30}>
                <FileDependencyPanel
                  fileName={dependencyFileName}
                  onClose={handleCloseDependencyPanel}
                />
              </Panel>
            ) : (
              <Panel defaultSize={60} minSize={30}>
                <SearchPreview
                  fileGroup={selectedFileGroup}
                  currentMatchId={selectedMatchId}
                  query={query}
                  onMatchSelect={handleSelectMatch}
                  onClose={handleClosePreview}
                />
              </Panel>
            )}
          </PanelGroup>
        ) : (
          <ScrollArea className="h-full">
            <div>
              {results.map((group) => (
                <SearchGroup
                  key={group.file.id}
                  group={group}
                  selectedMatchId={activeSearchResultId}
                  onSelectMatch={handleSelectMatch}
                  onShowDependencies={handleShowDependencies}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
