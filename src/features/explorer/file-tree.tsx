"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, FileCode2, Folder } from "lucide-react";
import { VBAFile } from "@/types/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState, EmptyStates } from "@/utils/empty-states";
import { cn } from "@/lib/utils";

interface FileTreeNode {
  type: "folder" | "file";
  name: string;
  path: string;
  children?: FileTreeNode[];
  file?: VBAFile;
}

interface FileTreeProps {
  files: VBAFile[];
  onSelectFile: (file: VBAFile) => void;
  selectedFileId?: string;
}

function buildFileTree(files: VBAFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const folderMap = new Map<string, FileTreeNode>();

  files.forEach((file) => {
    const parts = file.path.split("/");

    for (let i = 0; i < parts.length; i++) {
      const partPath = parts.slice(0, i + 1).join("/");
      const isFile = i === parts.length - 1;

      if (folderMap.has(partPath)) {
        continue;
      }

      const node: FileTreeNode = {
        type: isFile ? "file" : "folder",
        name: parts[i],
        path: partPath,
        ...(isFile && { file }),
      };

      if (i === 0) {
        root.push(node);
        folderMap.set(partPath, node);
      } else {
        const parentPath = parts.slice(0, i).join("/");
        const parent = folderMap.get(parentPath);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
          folderMap.set(partPath, node);
        }
      }
    }
  });

  // Sort recursively
  const sort = (nodes: FileTreeNode[]): FileTreeNode[] => {
    const sorted = nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    sorted.forEach((node) => {
      if (node.children) {
        node.children = sort(node.children);
      }
    });
    return sorted;
  };

  return sort(root);
}

function FileTreeItem({
  node,
  level = 0,
  onSelectFile,
  selectedFileId,
}: {
  node: FileTreeNode;
  level?: number;
  onSelectFile: (file: VBAFile) => void;
  selectedFileId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isFile = node.type === "file";

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 text-sm hover:bg-accent/20 rounded cursor-pointer group",
          isFile &&
            node.file?.id === selectedFileId &&
            "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isFile && node.file) {
            onSelectFile(node.file);
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {!isFile && node.children && (
          <button className="flex-shrink-0 p-0 hover:bg-muted rounded">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!isFile && !node.children && <div className="w-4 flex-shrink-0" />}

        {isFile ? (
          <FileCode2 className="w-4 h-4 flex-shrink-0 text-blue-500" />
        ) : (
          <Folder className="w-4 h-4 flex-shrink-0 text-amber-500" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {!isFile && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onSelectFile={onSelectFile}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  files,
  onSelectFile,
  selectedFileId,
}: FileTreeProps) {
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <EmptyState
          {...EmptyStates.noProject}
          action={undefined}
        />
      </div>
    );
  }

  const tree = buildFileTree(files);

  return (
    <ScrollArea className="h-full w-full">
      <div className="text-sm p-2">
        {tree.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            onSelectFile={onSelectFile}
            selectedFileId={selectedFileId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
