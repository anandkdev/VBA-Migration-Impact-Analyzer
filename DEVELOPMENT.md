# VBA Migration Impact Analyzer - Development Guide

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # Client providers
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── app-shell.tsx       # Main app layout
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── toolbar.tsx         # Top toolbar
│   ├── main-viewer.tsx     # Content area
│   └── inspector.tsx       # Right panel
├── features/
│   ├── dashboard/          # Dashboard module
│   ├── explorer/           # Project Explorer
│   ├── search/             # Search functionality
│   ├── analysis/           # Impact Analysis
│   ├── graph/              # Dependency Graph
│   ├── reports/            # Reports
│   └── settings/           # Settings
├── store/
│   ├── project-store.ts    # Project state management
│   └── settings-store.ts   # Settings state management
├── hooks/
│   └── use-theme.ts        # Theme hook
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check
```

Visit http://localhost:3000 in your browser.

## Architecture Decisions

### Tech Stack
- **Next.js 15**: App Router for modern React development
- **React 19**: Latest React with improved performance
- **TypeScript**: Strict type safety across the codebase
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable component library
- **Zustand**: Lightweight state management
- **React Flow**: Dependency graph visualization
- **XLSX**: Excel file parsing

### Design Patterns
- **Feature-based architecture**: Organized by feature modules
- **Component composition**: Small, reusable components
- **Strict TypeScript**: No `any` types allowed
- **SOLID principles**: Clean, maintainable code

### State Management
Zustand is used for global state:
- `projectStore`: Project and file management
- `settingsStore`: User preferences and settings

### UI/UX
- Modern developer tool design (inspired by VS Code, GitHub)
- Resizable panels for flexible layouts
- Dark mode support
- Responsive design

## Development Workflow

### Phase-based Development
Each phase is self-contained and tested before moving to the next:

1. **Phase 1**: Application Layout ✅
2. **Phase 2**: Folder Import
3. **Phase 3**: Project Explorer
4. **Phase 4**: VBA Parser
5. **Phase 5**: Search
6. **Phase 6**: Impact Analysis
7. **Phase 7**: Dependency Graph
8. **Phase 8**: Reports

### Code Quality
- Run `npm run type-check` before committing
- Run `npm run lint` to check code style
- No inline styles - use Tailwind CSS classes
- Comments only for non-obvious logic
- Prefer small, focused functions

## Key Files to Know

- `src/app/layout.tsx`: Root layout and metadata
- `src/components/app-shell.tsx`: Main layout with panels
- `src/features/*/`: Feature-specific components
- `src/store/`: Global state management
- `src/types/index.ts`: TypeScript type definitions
- `tailwind.config.ts`: Tailwind CSS configuration

## Common Tasks

### Adding a New Feature Module
1. Create folder: `src/features/feature-name/`
2. Create main component: `feature-name.tsx`
3. Import in `src/components/main-viewer.tsx`
4. Add navigation item in `src/components/sidebar.tsx`

### Adding a UI Component
1. Create file: `src/components/ui/component-name.tsx`
2. Export from component file
3. Use in features via `@/components/ui/component-name`

### Adding a Hook
1. Create file: `src/hooks/use-hook-name.ts`
2. Export hook function
3. Use via `@/hooks/use-hook-name`

## Performance Considerations

- Components use `'use client'` for interactivity
- State updates are scoped to minimize re-renders
- Resizable panels are memoized
- Code splitting via Next.js App Router

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires File System Access API for folder import

## File Format Support

The application supports analyzing these VBA-related file formats:
- `.bas` - VBA Module
- `.cls` - Class Module
- `.frm` - Form Module
- `.xlsm` - Excel Macro-Enabled Workbook
- `.xls` / `.xlsx` - Excel Workbook
- `.txt` - Text file
- `.csv` - Comma-separated values

---

For more information on specific features, see the individual feature documentation.
