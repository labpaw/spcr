# Spacer Architecture

## Overview

Spacer is a professional SaaS application built with **Nuxt 4**, **Vue 3**, and **TypeScript**. The architecture follows modern best practices with a focus on maintainability, scalability, and developer experience.

## Technology Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Language**: TypeScript for type safety
- **Styling**: Scoped CSS with design tokens
- **State Management**: Composables pattern
- **Icons**: @nuxt/icon
- **Storage**: LocalStorage for persistence

## Project Structure

```
spcr/
├── app/
│   ├── components/          # Reusable Vue components
│   │   ├── canvas/         # Canvas-specific elements
│   │   │   ├── TextElement.vue
│   │   │   ├── LinkElement.vue
│   │   │   └── ImageElement.vue
│   │   └── ui/             # UI components
│   │       ├── TypeSelector.vue
│   │       ├── ContextMenu.vue
│   │       ├── BackgroundSelector.vue
│   │       └── InfoPanel.vue
│   ├── composables/        # Reusable composition functions
│   │   ├── useElements.ts  # Element CRUD operations
│   │   ├── useBackground.ts # Background management
│   │   ├── useDrag.ts      # Drag functionality
│   │   └── useResize.ts    # Resize functionality
│   ├── config/             # Configuration files
│   │   ├── design-tokens.ts # Design system tokens
│   │   └── constants.ts    # App constants
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── pages/              # Nuxt pages (routes)
│   │   └── index.vue
│   └── app.vue             # Root component
├── public/                 # Static assets
└── nuxt.config.ts          # Nuxt configuration
```

## Design Principles

### 1. **Separation of Concerns**

- **Components**: UI presentation only
- **Composables**: Business logic and state management
- **Types**: Centralized type definitions
- **Config**: Design tokens and constants

### 2. **DRY (Don't Repeat Yourself)**

- Shared logic extracted into composables
- Reusable components
- Centralized design tokens

### 3. **Type Safety**

- Full TypeScript coverage
- Strict type checking
- Interface-based contracts

### 4. **Component Architecture**

- Small, focused components
- Clear prop interfaces
- Event-driven communication
- Composition over inheritance

## Core Concepts

### Composables

Composables are reusable functions that encapsulate reactive state and logic:

#### `useElements()`

Manages all element operations:

- `loadElements()` - Load from localStorage
- `saveElements()` - Save to localStorage
- `addElement()` - Create new element
- `deleteElement()` - Remove element
- `updateElement()` - Update element properties

#### `useBackground()`

Manages canvas background:

- `canvasBackground` - Reactive background value
- `setBackground()` - Update and persist background

#### `useDrag()`

Handles element dragging:

- `startDrag()` - Initialize drag
- `stopDrag()` - Complete drag operation
- `dragState` - Current drag state

#### `useResize()`

Handles image resizing:

- `startResize()` - Initialize resize
- `stopResize()` - Complete resize operation
- Free resize or constrained (Shift key)

### Design Tokens

Centralized design system in `config/design-tokens.ts`:

```typescript
colors: {
  primary: { DEFAULT, hover, light },
  danger: { DEFAULT, hover },
  neutral: { white, black, gray: {...} },
  background: { lightGray, white, warmBeige, ... }
}

spacing: { xs, sm, md, lg, xl, ... }
borderRadius: { sm, md, lg, full }
shadows: { sm, md, lg, xl }
typography: { fontFamily, fontSize, fontWeight }
zIndex: { base, dropdown, modal, contextMenu, ... }
animation: { duration, easing }
```

### Type System

All types defined in `types/index.ts`:

```typescript
- ElementType: 'text' | 'link' | 'image'
- Position: { x, y }
- SpacerElement: TextElement | LinkElement | ImageElement
- DragState, ResizeState
- BackgroundTheme
```

## Component Communication

### Props Down, Events Up

- Parent components pass data via props
- Child components emit events for user actions
- Unidirectional data flow

### Example:

```vue
<!-- Parent -->
<TextElement :element="element" :is-editing="isEditing" @stop-edit="handleStopEdit" />

<!-- Child emits -->
emit('stop-edit')
```

## State Management

### Local State

- Component-specific state using `ref()` and `reactive()`
- Managed within individual components

### Shared State

- Composables provide shared reactive state
- Auto-syncs with localStorage
- No global store needed (lightweight app)

## Styling Strategy

### Scoped Styles

- Each component has scoped CSS
- Prevents style leakage
- Component-specific styling

### Design Tokens

- Use tokens for consistency
- Easy theming
- Centralized updates

### CSS Best Practices

- BEM-like naming conventions
- Semantic class names
- Mobile-first approach

## Performance Considerations

### Code Splitting

- Nuxt auto-splits by route
- Dynamic imports for heavy components

### Reactivity

- Computed properties for derived state
- Debounced operations where needed
- Efficient re-renders

### Storage

- Debounced localStorage writes
- Lazy loading of saved data
- Minimal data structure

## Development Workflow

### Adding a New Element Type

1. **Add Type** in `types/index.ts`
2. **Create Component** in `components/canvas/`
3. **Update Constants** if needed
4. **Add to Main Page** in `pages/index.vue`

### Adding a New Feature

1. **Create Composable** if state/logic needed
2. **Create Components** for UI
3. **Add Types** for TypeScript support
4. **Update Design Tokens** if new styles needed
5. **Wire in Main Page**

### Modifying Design

1. **Update Tokens** in `config/design-tokens.ts`
2. Changes propagate automatically
3. Consistent across all components

## Testing Strategy

### Unit Tests

- Test composables independently
- Test component logic
- Mock dependencies

### Integration Tests

- Test component interactions
- Test user flows
- Test storage persistence

### E2E Tests

- Test complete user journeys
- Test cross-browser compatibility
- Test performance

## Future Enhancements

### Potential Improvements

- [ ] Undo/Redo functionality
- [ ] Multi-select and bulk operations
- [ ] Export to image/PDF
- [ ] Collaboration features
- [ ] Template system
- [ ] Cloud storage integration
- [ ] Mobile touch support optimization
- [ ] Accessibility improvements (ARIA labels)
- [ ] Keyboard shortcuts
- [ ] Search/filter elements

### Scalability Considerations

- Component library extraction
- API integration layer
- User authentication
- Multi-user real-time sync
- Analytics integration
- Error tracking (Sentry)
- Performance monitoring

## Best Practices

### Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint for code standards
- ✅ Consistent naming conventions
- ✅ Documented functions
- ✅ Single Responsibility Principle

### Git Workflow

- Feature branches
- Descriptive commit messages
- Code reviews
- Semantic versioning

### Documentation

- Component documentation
- Function JSDoc comments
- Architecture diagrams
- Setup instructions

## Conclusion

This architecture provides a solid foundation for building a professional SaaS application. The modular structure, type safety, and separation of concerns make the codebase maintainable and scalable for future growth.
