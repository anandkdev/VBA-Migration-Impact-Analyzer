# Dependency Graph Feature - User Guide

## Overview
The dependency graph is now integrated directly into the **Search module**, making it easier to understand how files relate to each other without leaving the search interface.

## What You'll See

### Before (Old Layout)
```
┌─────────────────────────────────┐
│ Sidebar                         │
├─ Dashboard                      │
├─ Project Explorer               │
├─ Search                         │
├─ Impact Analysis                │
├─ Dependency Graph ← SEPARATE TAB │
├─ Reports                        │
├─ Settings                       │
└─ Help                           │
```

### After (New Layout)
```
┌─────────────────────────────────┐
│ Sidebar (Updated)               │
├─ Dashboard                      │
├─ Project Explorer               │
├─ Search                         │
├─ Impact Analysis                │
├─ Reports                        │
├─ Settings                       │
└─ Help                           │
```

**Dependency Graph is now accessible from within the Search module!**

## Using the Feature

### Step 1: Go to Search
Click on the **Search** option in the sidebar to open the search module.

### Step 2: Perform a Search
Type your search query (e.g., "Sub SalesReport", "Module", "Procedure Name", etc.)

### Step 3: View Results
Your search results appear as file groups showing:
- File name and path
- Number of matches found
- **NEW: Dependency Graph Icon** 📊 (appears on hover)

### Step 4: Click the Dependency Icon
Hover over any search result file group and click the **GitGraph icon** (📊) that appears on the right side.

### Step 5: View Dependencies
The right panel now shows:

#### Dependencies Section 1: "Files this depends on"
```
┌─────────────────────────────────┐
│ Dependencies                    │
│                                 │
│ Files this depends on (2)       │
│ ├─ Module_Database              │
│ │  ├─ ⚡ GetSalesData           │
│ │  └─ ⚡ GetUserData            │
│ │                               │
│ └─ Module_Utils                 │
│    ├─ ⚡ FormatDate             │
│    └─ ⚡ ValidateInput          │
│                                 │
│ Files that depend on this (1)   │
│ └─ Module_Admin                 │
│    └─ ⚡ AdminReport            │
│                                 │
│ ⚠️ Impact Analysis              │
│ • Changing affects 1 other file │
│ • Depends on 2 other files      │
│ Files to update: Module_Admin   │
└─────────────────────────────────┘
```

## Screen Layout During Search with Dependency Panel Open

```
┌──────────────────────────────────────────────────────────┐
│ Search Bar | Options | Replace                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─────────────────┬─────────────────────────────────────┐│
│ │  Search Results │  Dependency Panel (when opened)    ││
│ │                 │                                     ││
│ │ Module_Reports  │  Dependencies                       ││
│ │ ► path/to/file  │                                     ││
│ │                 │  Files this depends on:             ││
│ │   ✓ Line 45     │  • Module_Database (2 calls)        ││
│ │   ✓ Line 67     │  • Module_Utils (3 calls)           ││
│ │   ✓ Line 89     │                                     ││
│ │ [📊 icon]       │  Files that depend on this:         ││
│ │                 │  • Module_Admin (1 call)            ││
│ │ ─────────────── │  • Module_Dashboard (1 call)        ││
│ │                 │                                     ││
│ │ Module_Utils    │  ⚠️ Impact Analysis                 ││
│ │ ► path/to/file  │  Affects 2 files                    ││
│ │                 │  Depends on 2 files                 ││
│ │   ✓ Line 12     │                                     ││
│ │   ✓ Line 34     │  Files to update:                   ││
│ │ [📊 icon]       │  Module_Admin, Module_Dashboard     ││
│ │                 │                                     ││
│ └─────────────────┴─────────────────────────────────────┘│
│  ← drag to resize →                                       │
└──────────────────────────────────────────────────────────┘
```

## Understanding the Dependency Information

### Key Symbols:
- **⚡** = Procedure/Function
- **📦** = Module (file)
- **🔒** = Private scope
- **⚠️** = Impact warning

### What Each Section Means:

#### "Files this depends on" 
**These are files that the selected file calls/uses**
- If you modify these files, your current file might break
- Lists specific procedures being called
- Example: If Module_Reports depends on Module_Database, changing Module_Database could break Module_Reports

#### "Files that depend on this"
**These are files that call/use the selected file**
- If you modify your current file, these files might break
- Lists specific procedures from your file that are being called
- Example: If Module_Admin depends on Module_Reports, changing Module_Reports could break Module_Admin

#### "Impact Analysis"
Quick summary showing:
- ✅ How many files would be affected by changes
- ✅ How many external dependencies exist
- ✅ Specific list of files that need updates

## Common Use Cases

### 1. Before Modifying a File
1. Search for the file you want to modify
2. Click the dependency icon
3. Check which files depend on it
4. Update all dependent files along with the original

### 2. Understanding Call Chains
1. Search for a procedure
2. View its dependencies
3. Trace up the chain to see who calls it
4. Trace down to see what it calls

### 3. Impact Assessment
1. Search for the files you're changing
2. Click dependency icons for each
3. Review the "Impact Analysis" section
4. Make a list of all files that need updates

### 4. Circular Dependency Detection
1. If you see file A → B and B → A, that's circular
2. This can cause issues during migration
3. Flag these for special handling

## Tips and Tricks

✅ **Hover over file groups** - The dependency icon appears on hover for a cleaner interface

✅ **Resizable panels** - Drag the divider between results and dependency panel to adjust sizes

✅ **Close the panel** - Click the X button to close the dependency panel and go back to preview mode

✅ **Search within dependencies** - After viewing dependencies, modify your search query to find related files

✅ **Multiple searches** - Perform multiple searches to understand different dependency chains

## Troubleshooting

### I don't see the dependency icon
- Make sure you're in the **Search** view (not Impact Analysis or other sections)
- Hover over a file group header - the icon appears on hover
- The icon is a GitGraph symbol (📊)

### The dependency panel is empty
- This usually means the file has no external dependencies
- It's called by other files (upward dependencies), but doesn't call anything
- Check the "Files that depend on this" section

### The information seems incomplete
- Dependencies are based on actual code analysis
- Only shows module-level calls that could be detected
- Private procedures may have limitations in dependency tracking

## Related Features

- **Impact Analysis Tab** - Shows broader impact analysis across the entire codebase
- **Project Explorer** - Visualize the file structure
- **Code Viewer** - View actual code and verify dependencies manually
