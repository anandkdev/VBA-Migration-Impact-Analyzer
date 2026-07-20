"use client";

import React, { useState } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FolderOpen,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import {
  importProjectFromFolder,
  importFilesFromSelection,
} from "@/features/import/import-service";

type ImportStatus = "idle" | "loading" | "success" | "error";
type ImportMode = "folder" | "files";

interface ImportResult {
  status: ImportStatus;
  message: string;
  filesRead?: number;
  filesSkipped?: number;
  error?: string;
}

export function ImportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("folder");
  const [importStatus, setImportStatus] = useState<ImportResult>({
    status: "idle",
    message: "",
  });
  const { setProjectName } = useProjectStore();

  const handleImportFolder = async () => {
    try {
      setImportStatus({
        status: "loading",
        message: "Opening folder picker...",
      });

      // Check if File System Access API is available
      if (!("showDirectoryPicker" in window)) {
        setImportStatus({
          status: "error",
          message:
            "File System Access API not supported in your browser. Please use Chrome, Edge, or Safari 15+.",
          error: "Not supported",
        });
        return;
      }

      // Show folder picker
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: "read",
      });

      setImportStatus({
        status: "loading",
        message: `Scanning folder: ${dirHandle.name}...`,
      });

      // Import project
      const result = await importProjectFromFolder(dirHandle);

      if (result.success) {
        setProjectName(dirHandle.name);
        setImportStatus({
          status: "success",
          message: `Project imported successfully!`,
          filesRead: result.filesRead,
          filesSkipped: result.filesSkipped,
        });

        // Auto-close dialog after 2 seconds
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setImportStatus({
          status: "error",
          message: result.error || "Failed to import project",
          error: result.error,
        });
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        setImportStatus({
          status: "idle",
          message: "Import cancelled",
        });
      } else {
        setImportStatus({
          status: "error",
          message: `Error: ${(error as Error).message}`,
          error: (error as Error).message,
        });
      }
    }
  };

  const handleImportFiles = async () => {
    try {
      setImportStatus({ status: "loading", message: "Opening file picker..." });

      // Check if File System Access API is available
      if (!("showOpenFilePicker" in window)) {
        setImportStatus({
          status: "error",
          message:
            "File System Access API not supported in your browser. Please use Chrome, Edge, or Safari 15+.",
          error: "Not supported",
        });
        return;
      }

      // Show file picker
      const handles = await (window as any).showOpenFilePicker({
        mode: "read",
        multiple: true,
        types: [
          {
            description: "VBA & Code Files",
            accept: {
              "text/*": [".bas", ".cls", ".frm", ".txt"],
              "text/csv": [".csv"],
              "application/vnd.ms-excel": [".xls", ".xlsx"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            },
          },
        ],
      });

      setImportStatus({
        status: "loading",
        message: `Importing ${handles.length} file(s)...`,
      });

      // Import files
      const result = await importFilesFromSelection(handles);

      if (result.success) {
        setProjectName("Imported Files");
        setImportStatus({
          status: "success",
          message: `Files imported successfully!`,
          filesRead: result.filesRead,
          filesSkipped: result.filesSkipped,
        });

        // Auto-close dialog after 2 seconds
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setImportStatus({
          status: "error",
          message: result.error || "Failed to import files",
          error: result.error,
        });
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        setImportStatus({
          status: "idle",
          message: "Import cancelled",
        });
      } else {
        setImportStatus({
          status: "error",
          message: `Error: ${(error as Error).message}`,
          error: (error as Error).message,
        });
      }
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full" size="sm">
        <Upload className="w-4 h-4" />
        Import Tool
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Import VBA Project</h2>

              <div className="space-y-4">
                {/* Status Display */}
                <div
                  className={cn(
                    "p-4 rounded-lg border flex gap-3",
                    importStatus.status === "loading" &&
                      "border-blue-500/50 bg-blue-500/10",
                    importStatus.status === "success" &&
                      "border-green-500/50 bg-green-500/10",
                    importStatus.status === "error" &&
                      "border-red-500/50 bg-red-500/10",
                    importStatus.status === "idle" &&
                      "border-muted bg-muted/50",
                  )}
                >
                  {importStatus.status === "loading" && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  {importStatus.status === "success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  {importStatus.status === "error" && (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {importStatus.message}
                    </p>
                    {importStatus.filesRead !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Files read: {importStatus.filesRead}
                        {importStatus.filesSkipped
                          ? ` | Skipped: ${importStatus.filesSkipped}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                {importStatus.status === "idle" && (
                  <div className="p-3 bg-muted/50 rounded border border-border text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Supported formats:</p>
                    <ul className="text-xs space-y-1">
                      <li>• VBA Modules: .bas, .cls, .frm</li>
                      <li>• Excel: .xlsm, .xls, .xlsx</li>
                      <li>• Other: .txt, .csv</li>
                    </ul>
                  </div>
                )}

                {/* Info Box for Browser Support */}
                {importStatus.status === "error" &&
                  importStatus.error?.includes("not supported") && (
                    <div className="p-3 bg-red-500/10 rounded border border-red-500/30 text-sm text-red-700 dark:text-red-400">
                      <p className="font-medium mb-1">Browser Compatibility</p>
                      <p className="text-xs">
                        This feature requires the File System Access API. Please
                        use:
                      </p>
                      <ul className="text-xs mt-1 space-y-0.5">
                        <li>• Chrome 86+</li>
                        <li>• Edge 86+</li>
                        <li>• Safari 15+</li>
                      </ul>
                    </div>
                  )}
              </div>

              {/* Mode Selection */}
              {importStatus.status === "idle" && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setImportMode("folder")}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium text-sm",
                      importMode === "folder"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-blue-300",
                    )}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Folder
                  </button>
                  <button
                    onClick={() => setImportMode("files")}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium text-sm",
                      importMode === "files"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-blue-300",
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Files
                  </button>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsOpen(false);
                    setImportStatus({ status: "idle", message: "" });
                    setImportMode("folder");
                  }}
                  disabled={importStatus.status === "loading"}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={
                    importMode === "folder"
                      ? handleImportFolder
                      : handleImportFiles
                  }
                  disabled={importStatus.status === "loading"}
                >
                  {importStatus.status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {importMode === "folder"
                        ? "Select Folder"
                        : "Select Files"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
