# Loading Indicators & Skeleton Loaders System

## Overview

A comprehensive, reusable loading system with spinners, skeleton loaders, and loading overlays for all modules.

**Key Features**:
- ✅ Spinner component (animated SVG)
- ✅ Search input with inline spinner
- ✅ Skeleton loaders with shimmer animation
- ✅ Full-screen loading overlays
- ✅ Themed colors (light/dark)
- ✅ Type-safe components
- ✅ Zero-dependency animations (CSS only)

---

## Components

### 1. Spinner

**Location**: `src/components/loaders/spinner.tsx`

Animated loading spinner with three size options.

```typescript
import { Spinner } from '@/components/loaders/spinner'

// Small spinner
<Spinner size="sm" />

// Medium (default)
<Spinner size="md" />

// Large
<Spinner size="lg" />

// With custom class
<Spinner size="md" className="text-blue-500" />
```

**Usage in Buttons**:
```typescript
<Button disabled={isLoading} className="gap-2">
  {isLoading ? (
    <Spinner size="sm" />
  ) : (
    <Search className="w-4 h-4" />
  )}
  {isLoading ? 'Searching...' : 'Search'}
</Button>
```

---

### 2. SearchInputLoader

**Location**: `src/components/loaders/search-input-loader.tsx`

Search input field with integrated spinner and clear button.

```typescript
import { SearchInputLoader } from '@/components/loaders/search-input-loader'

<SearchInputLoader
  value={query}
  onChange={(q) => setQuery(q)}
  onClear={() => setQuery('')}
  isLoading={isSearching}
  placeholder="Search files..."
  autoFocus
/>
```

**Behavior**:
- Shows spinner while `isLoading={true}`
- Shows clear (×) button when has value
- Auto-focus on mount
- No spinner when empty

---

### 3. LoadingOverlay

**Location**: `src/components/loaders/loading-overlay.tsx`

Full-screen or element overlay with spinner and message.

```typescript
import { LoadingOverlay } from '@/components/loaders/loading-overlay'

// Full-screen overlay
<LoadingOverlay
  isLoading={isLoading}
  message="Building graph..."
  fullScreen
/>

// Element overlay
<div className="relative h-96">
  <LoadingOverlay
    isLoading={isLoading}
    message="Loading..."
  />
</div>
```

**Props**:
- `isLoading`: Show/hide overlay
- `message`: Optional text below spinner
- `fullScreen`: Overlay entire screen or just container

---

### 4. Skeleton Loaders

**Location**: `src/components/loaders/skeleton-loader.tsx`

Animated placeholder components for content loading.

#### Basic Skeleton

```typescript
import { Skeleton } from '@/components/loaders/skeleton-loader'

// Placeholder box
<Skeleton className="h-8 w-32" />

// Placeholder text line
<Skeleton className="h-4 w-full" />
```

#### SkeletonLines

```typescript
import { SkeletonLines } from '@/components/loaders/skeleton-loader'

// Multiple lines (default 3)
<SkeletonLines count={5} />
```

#### Preset Loaders

```typescript
import {
  SearchResultSkeleton,
  FileTreeSkeleton,
  ImpactResultsSkeleton,
} from '@/components/loaders/skeleton-loader'

// Search results placeholder
<SearchResultSkeleton />

// File tree placeholder
<FileTreeSkeleton />

// Impact analysis results placeholder
<ImpactResultsSkeleton />
```

---

## Integration Examples

### Search Module (Primary Implementation)

**Search Input with Spinner**:
```typescript
<SearchInputLoader
  value={query}
  onChange={setQuery}
  onClear={() => setQuery('')}
  isLoading={isSearching}
/>
```

**Results with Skeleton**:
```typescript
{isSearching ? (
  <SearchResultSkeleton />
) : results.length === 0 ? (
  <NoResults />
) : (
  <ResultsList results={results} />
)}
```

---

### Project Explorer Module

**File Tree Loading**:
```typescript
const [isLoadingTree, setIsLoadingTree] = useState(false)

// Simulate loading when files change
useEffect(() => {
  if (files.length > 0) {
    setIsLoadingTree(true)
    setTimeout(() => setIsLoadingTree(false), 300)
  }
}, [files])

// Show skeleton while loading
{isLoadingTree ? (
  <FileTreeSkeleton />
) : (
  <FileTree files={files} />
)}
```

---

### Impact Analysis Module

**Analyze Button with Spinner**:
```typescript
<Button
  onClick={handleAnalyze}
  disabled={isAnalyzing || !fieldName.trim()}
  className="gap-2"
>
  {isAnalyzing ? (
    <Spinner size="sm" />
  ) : (
    <Search className="w-4 h-4" />
  )}
  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
</Button>
```

**Results with Skeleton**:
```typescript
{isAnalyzing ? (
  <ImpactResultsSkeleton />
) : results.length === 0 ? (
  <NoResults />
) : (
  <ImpactResults results={results} />
)}
```

---

### General Pattern (Any Module)

```typescript
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState([])

const handleAction = async () => {
  setIsLoading(true)
  try {
    const result = await fetchData()
    setData(result)
  } finally {
    setIsLoading(false)
  }
}

// UI
{isLoading ? (
  <SkeletonLines count={5} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList data={data} />
)}
```

---

## Styling

### Spinner

- **Color**: Inherits from `text-primary` (blue by default)
- **Animation**: CSS `animate-spin` (60fps)
- **Size**: Configurable (sm=4px, md=6px, lg=8px)

### Skeleton

- **Color**: Uses `bg-muted` class
- **Animation**: CSS `animate-pulse` (opacity 0.5-1.0)
- **Customizable**: Use `className` prop

### LoadingOverlay

- **Background**: `bg-background/80` with `backdrop-blur-sm`
- **Stacking**: Uses `z-50` (fullScreen) or positioned absolutely
- **Color**: Text uses `text-muted-foreground`

---

## Theming

All components respect the app's theme (light/dark):

```typescript
// Light theme
<Spinner /> // Blue spinner

// Dark theme
<Spinner /> // Blue spinner (adjusted for dark background)
```

---

## Performance

### Animations

- **Spinner**: Pure CSS animation, zero JS overhead
- **Skeleton**: Pure CSS pulse, no JavaScript
- **60fps**: Hardware-accelerated animations
- **No Layout Shift**: Fixed dimensions prevent jumping

### Memory

- **Lightweight**: ~5KB total (minified)
- **No Dependencies**: Pure React + CSS
- **No Images**: SVG inline, no network requests

---

## Best Practices

### 1. Match Content Type

```typescript
// Search results loading
<SearchResultSkeleton />

// Generic list loading
<SkeletonLines count={10} />

// File tree loading
<FileTreeSkeleton />
```

### 2. Show Only When Necessary

```typescript
// Good: Show skeleton only while loading
{isLoading ? <Skeleton /> : <Content />}

// Avoid: Always showing skeleton
{<Skeleton />}
```

### 3. Proper Message Text

```typescript
// Good: Clear what's loading
<LoadingOverlay message="Searching files..." />

// Avoid: Generic message
<LoadingOverlay message="Loading..." />
```

### 4. Consistent Timing

```typescript
// Good: Simulate realistic loading
setIsLoading(true)
setTimeout(() => {
  setData(result)
  setIsLoading(false)
}, 300) // 300ms minimum visibility

// Avoid: Flash loading state
setIsLoading(false)
setData(result)
setIsLoading(true)
```

---

## Examples by Module

### Search Module (Current Implementation)

**Search Input**:
```typescript
<SearchInputLoader
  value={query}
  onChange={setQuery}
  onClear={handleClear}
  isLoading={isSearching || isInitializing}
/>
```

**Results**:
```typescript
{isSearching ? (
  <SearchResultSkeleton />
) : (
  <ResultsList results={results} />
)}
```

---

### Dependency Graph (Future Integration)

```typescript
const [isBuilding, setIsBuilding] = useState(false)

const handleBuild = async () => {
  setIsBuilding(true)
  try {
    const graph = await buildDependencyGraph()
    setGraph(graph)
  } finally {
    setIsBuilding(false)
  }
}

// UI
<button disabled={isBuilding} className="gap-2">
  {isBuilding && <Spinner size="sm" />}
  {isBuilding ? 'Building...' : 'Build Graph'}
</button>
```

---

### Reports Module (Future Integration)

```typescript
const [isGenerating, setIsGenerating] = useState(false)

const handleGenerate = async () => {
  setIsGenerating(true)
  try {
    const report = await generateReport()
    downloadReport(report)
  } finally {
    setIsGenerating(false)
  }
}

// Full-screen overlay while generating
<LoadingOverlay
  isLoading={isGenerating}
  message="Generating report..."
  fullScreen
/>
```

---

## Accessibility

### Screen Readers

Loaders are announced through context:
- Button text: "Searching..." (announces action)
- Overlay message: "Generating report..." (announces activity)

### Keyboard Navigation

- Buttons with spinners remain keyboard accessible
- Loading state disables button to prevent double-click
- Escape or other keys work when appropriate

### Color Contrast

- Spinner text: Blue on white/dark (sufficient contrast)
- Skeleton text: Medium gray (muted) on background
- Overlay: Semi-transparent to show content beneath

---

## Customization

### Change Spinner Color

```typescript
<Spinner size="md" className="text-green-500" />
```

### Custom Skeleton Sizing

```typescript
<Skeleton className="h-2 w-1/3" /> {/* Small */}
<Skeleton className="h-4 w-full" /> {/* Regular */}
<Skeleton className="h-8 w-full" /> {/* Large */}
```

### Custom Skeleton Count

```typescript
<SkeletonLines count={20} className="h-6" />
```

### Custom Overlay Styling

```typescript
<LoadingOverlay
  isLoading={true}
  message="Please wait..."
  fullScreen
/>
```

---

## Common Patterns

### Loading with Error Handling

```typescript
const [state, setState] = useState('idle') // idle | loading | error | success

const handleAction = async () => {
  setState('loading')
  try {
    const result = await fetchData()
    setState('success')
    setData(result)
  } catch (error) {
    setState('error')
    setError(error)
  }
}

// UI
{state === 'loading' && <Skeleton />}
{state === 'error' && <ErrorMessage />}
{state === 'success' && <DataList />}
```

### Loading with Timeout

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleAction = async () => {
  setIsLoading(true)
  try {
    const result = await Promise.race([
      fetchData(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ])
    setData(result)
  } finally {
    setIsLoading(false)
  }
}
```

### Staggered Skeletons

```typescript
{isLoading ? (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-12 w-full"
        style={{
          animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) ${i * 0.1}s infinite`,
        }}
      />
    ))}
  </div>
) : (
  <ContentList />
)}
```

---

## TypeScript Definitions

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface SearchInputLoaderProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  isLoading?: boolean
  placeholder?: string
  autoFocus?: boolean
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  fullScreen?: boolean
}

interface SkeletonProps {
  className?: string
}

interface SkeletonLinesProps {
  count?: number
  className?: string
}
```

---

## Troubleshooting

### Spinner Not Showing

**Problem**: Spinner invisible or not animating

**Solution**:
```typescript
// Make sure color is visible
<Spinner className="text-primary" /> // or text-blue-500

// Check parent opacity
<div style={{ opacity: 1 }}>
  <Spinner />
</div>
```

### Skeleton Causing Layout Shift

**Problem**: Page jumps when skeleton unmounts

**Solution**:
```typescript
// Use fixed height
<Skeleton className="h-8 w-full" /> {/* Fixed height */}

// Not just responsive
<Skeleton className="w-full" /> {/* Bad: no height */}
```

### Too Many Loaders

**Problem**: Page feels slow or cluttered

**Solution**:
```typescript
// Only show when actually loading (>300ms)
const [isLoading, setIsLoading] = useState(false)

setTimeout(() => setIsLoading(true), 300)

// Render placeholder only after delay
{isLoading && <Skeleton />}
```

---

## Summary

| Component | Use Case | Location |
|-----------|----------|----------|
| **Spinner** | Buttons, inline | `loaders/spinner.tsx` |
| **SearchInputLoader** | Search fields | `loaders/search-input-loader.tsx` |
| **LoadingOverlay** | Full-screen / modal | `loaders/loading-overlay.tsx` |
| **Skeleton** | Content placeholders | `loaders/skeleton-loader.tsx` |
| **SearchResultSkeleton** | Search results | `loaders/skeleton-loader.tsx` |
| **FileTreeSkeleton** | File trees | `loaders/skeleton-loader.tsx` |
| **ImpactResultsSkeleton** | Analysis results | `loaders/skeleton-loader.tsx` |

All components are:
- ✅ Type-safe (TypeScript)
- ✅ Theme-aware (light/dark)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Performant (CSS animations)
- ✅ Reusable (no dependencies)

---

*Last Updated: 2026-07-20*  
*Version: 1.0*
