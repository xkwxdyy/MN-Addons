# MNTaskBoard

A modern task management board application for MarginNote, built with Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **Focus View**: Manage priority focus tasks and pending tasks
- **Kanban Board**: Drag-and-drop task management by type
- **Perspective View**: Custom filters and grouping options
- **Task Hierarchy**: Support for parent-child task relationships
- **Progress Tracking**: Track task progress with history
- **Import/Export**: JSON data import/export functionality
- **Dark Theme**: Modern dark UI with glassmorphism effects

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## 🏗️ Project Structure

```
mntask-board/
├── app/                    # Next.js app directory
├── components/
│   ├── ui/                # Shadcn/ui components
│   └── theme-provider.tsx # Theme provider
├── constants/             # Application constants
├── services/             # Service layer
│   └── storage.ts        # LocalStorage service
├── types/               # TypeScript type definitions
│   └── task.ts          # Task-related types
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── public/             # Static assets
```

## 🔧 Recent Optimizations (2025-01-05)

### ✅ Completed

1. **Cleaned up file structure**
   - Removed 52 duplicate UI component files from root and `/ui` directories
   - Deleted 20 unnecessary .zip backup files
   - Consolidated all UI components in `components/ui/`

2. **Fixed project configuration**
   - Updated package.json with proper project name and description
   - Locked all dependency versions (removed "latest" references)

3. **Improved code organization**
   - Created `types/task.ts` for all type definitions
   - Created `constants/index.ts` for application constants
   - Created `services/storage.ts` for localStorage operations

### 🚧 TODO - High Priority

1. **Component Refactoring** (Critical)
   - Split `mntask-board.tsx` (2132 lines) into smaller components
   - Extract task management logic to `hooks/useTaskManager.ts`
   - Extract perspective logic to `hooks/usePerspectives.ts`
   - Move business components to `components/` directory

2. **Code Quality**
   - Add ESLint configuration
   - Add Prettier configuration
   - Setup Husky pre-commit hooks
   - Add TypeScript strict mode checks

3. **Testing**
   - Setup Jest and React Testing Library
   - Add unit tests for core functions
   - Add integration tests for task operations
   - Add E2E tests for user workflows

4. **Performance Optimization**
   - Implement React.memo for heavy components
   - Add virtual scrolling for large task lists
   - Optimize localStorage operations with debouncing

5. **Documentation**
   - Add JSDoc comments to all functions
   - Create API documentation
   - Add contribution guidelines

## 🐛 Known Issues

1. **Task Description Persistence** (Fixed)
   - Previously: Task descriptions were lost after modal close
   - Solution: Fixed allTasks synchronization logic

2. **Code Organization**
   - Main component file is too large (2132 lines)
   - Needs modularization and separation of concerns

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2.4
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI / shadcn/ui
- **State**: React hooks + localStorage

## 📝 Development Guidelines

1. **File Organization**
   - UI components go in `components/ui/`
   - Business components go in `components/`
   - Types go in `types/`
   - Constants go in `constants/`
   - Services go in `services/`

2. **Naming Conventions**
   - Components: PascalCase
   - Functions/hooks: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Types/Interfaces: PascalCase

3. **State Management**
   - Use React hooks for local state
   - Use localStorage for persistence
   - Always update all three task arrays (tasks, pendingTasks, allTasks)

## 📄 License

Private project - All rights reserved

## 👥 Contributors

MN-Addon Development Team

---

*Last updated: 2025-01-05*