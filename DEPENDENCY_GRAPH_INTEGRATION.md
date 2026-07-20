# Dependency Graph Integration - Search Module

## Summary of Changes

The dependency graph has been successfully integrated into the search module. Users can now view file dependencies directly from search results without needing to navigate to a separate section.

## What Changed

### 1. **Removed from Sidebar**
   - Removed "Dependency Graph" from the sidebar navigation items
   - Removed the unused `GitGraph` import from sidebar
   - Removed the dependency graph case from main-viewer routing

### 2. **New Component: `FileDependencyPanel`**
   - Location: `src/components/search/file-dependency-panel.tsx`
   - Displays bidirectional dependency information for a selected file:
     - **Files this depends on**: Shows which other modules/files this file calls
     - **Files that depend on this**: Shows which other modules/files call this file
     - Shows the specific procedures being called in each dependency
   - Includes impact analysis summary showing which files need to be updated

### 3. **Enhanced Search Group Component**
   - Location: `src/components/search/search-group.tsx`
   - Added a dependency graph icon button (👁️ GitGraph icon) to each file group header
   - Button appears on hover for a cleaner UI
   - Clicking the icon triggers the dependency panel display
   - Passes the `onShowDependencies` callback to parent

### 4. **Updated File Search View**
   - Location: `src/features/search/file-search-view.tsx`
   - Added state management for dependency panel:
     - `showDependencyPanel`: Boolean to track if panel is visible
     - `dependencyFileName`: Current file selected for dependency viewing
   - Dynamic panel layout:
     - When no file is selected: Shows search results only
     - When file is selected without dependency view: Shows search results + preview
     - When dependency panel is open: Shows search results + dependency panel
   - Resizable panels with configurable widths

## How It Works

1. **User performs a search** - Results display as before with all matching files
2. **User hovers over a file group** - A dependency graph icon appears on the right
3. **User clicks the icon** - The dependency panel opens on the right side showing:
   - Files/modules that this file depends on
   - Which procedures are being called in those files
   - Files/modules that depend on this file
   - Which procedures are being called from those files
   - Impact summary warning about how many files would be affected

## Dependency Analysis

### Files this depends on:
Shows all external modules this file calls, grouped by module name with their procedures listed.

### Files that depend on this:
Shows all modules that call procedures in this file, useful for understanding impact of changes.

### Impact Information:
- Count of files affected by changes to this file
- Count of files this file depends on
- Specific list of files that would need updating

## File Dependencies Explained

When you see a file's dependencies, you're looking at the module/procedure call graph:
- **Downward dependency**: File A calls File B (if you change File B, File A might break)
- **Upward dependency**: File C calls File A (if you change File A, File C might break)

## Example Scenario

If you're searching for "Sub SalesReport" and find it in Module_Reports:
1. Click the dependency graph icon next to "Module_Reports"
2. You see that Module_Reports depends on:
   - Module_Database (calls: GetSalesData)
   - Module_Utils (calls: FormatDate, ValidateInput)
3. And these modules depend on Module_Reports:
   - Module_Admin (calls: SalesReport)
   - Module_Dashboard (calls: SalesReport)

This tells you that changing Module_Reports affects Module_Admin and Module_Dashboard, and depends on Module_Database and Module_Utils.

## Technical Details

### Dependency Detection
- Parses procedure call patterns: `ModuleName.ProcedureName(...)`
- Builds bidirectional dependency map at runtime
- Handles both explicit calls and complex call chains

### Performance
- Dependency calculation is memoized using useMemo
- Only recalculates when files, modules, or selected file changes
- Efficient filtering with Set-based lookups

### UI/UX
- Smooth transitions with hover states
- Compact card-based layout for dependencies
- Color-coded impact information (warning colors for high-impact changes)
- Clear visual hierarchy with procedures indented under modules

## Future Enhancements

Potential improvements:
- Visual graph rendering (using ReactFlow) for large dependency trees
- Depth control (show only direct dependencies vs. transitive)
- Highlight affected files when you edit a file
- Export dependency report
- Circular dependency detection and warnings
