# Spacer (spcr)

A small, flexible canvas where you can create, organize, and share anything. Click anywhere to add text, links, or images, then drag them around until it feels right. No templates, no setup—just a blank space you shape yourself.

![Spacer Demo](public/demo.png)

## ✨ Features

- **🎨 Freeform Canvas** - Click anywhere to place elements exactly where you want
- **📝 Multiple Element Types** - Add text, links, and images with ease
- **🖱️ Drag & Drop** - Move elements smoothly across the entire canvas
- **🔄 Image Resizing** - Resize images freely or hold Shift to maintain aspect ratio
- **🎭 Customizable Backgrounds** - 9 beautiful color themes including dark mode
- **💾 Auto-Save** - Everything saves automatically to your browser
- **🎯 Figma-like UX** - Professional, intuitive interface
- **⚡ Blazing Fast** - Built with Nuxt 4 and Vue 3 for optimal performance

## 🏗️ Architecture

Spacer is built with world-class SaaS architecture principles:

- **TypeScript** - Full type safety across the codebase
- **Composables** - Reusable logic with Vue 3 Composition API
- **Component-Based** - Modular, maintainable UI components
- **Design Tokens** - Centralized design system
- **DRY Principles** - No code repetition
- **Separation of Concerns** - Clean architecture patterns

📖 Read the full [Architecture Documentation](ARCHITECTURE.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:labpaw/spcr.git
cd spcr

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your Spacer canvas!

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
spcr/
├── app/
│   ├── components/          # Vue components
│   │   ├── canvas/         # Element components (Text, Link, Image)
│   │   └── ui/             # UI components (Menus, Panels)
│   ├── composables/        # Reusable logic
│   │   ├── useElements.ts  # Element CRUD
│   │   ├── useBackground.ts
│   │   ├── useDrag.ts
│   │   └── useResize.ts
│   ├── config/             # Configuration
│   │   ├── design-tokens.ts # Design system
│   │   └── constants.ts
│   ├── types/              # TypeScript types
│   ├── pages/              # Nuxt pages
│   └── app.vue             # Root component
├── public/                 # Static assets
├── ARCHITECTURE.md         # Architecture docs
└── nuxt.config.ts          # Nuxt config
```

## 🎯 Usage

### Adding Elements

1. **Click anywhere** on the canvas
2. Choose **Text**, **Link**, or **Image** from the popup menu
3. Edit the content directly
4. Click outside to finish editing

### Moving Elements

- **Click and drag** any element to move it
- Elements can be positioned anywhere on the canvas

### Resizing Images

- **Hover over an image** to see the resize handle
- **Drag the corner** to resize freely
- **Hold Shift** while dragging to maintain aspect ratio

### Changing Background

- **Right-click** anywhere on the canvas
- Select **Background** from the context menu
- Choose from 9 beautiful color themes

### Deleting Elements

- **Hover over an element** to see the delete button (×)
- **Click the ×** to remove the element

## 🛠️ Technology Stack

- **[Nuxt 4](https://nuxt.com/)** - The Intuitive Vue Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[@nuxt/icon](https://nuxt.com/modules/icon)** - Icon management
- **[@nuxt/fonts](https://nuxt.com/modules/fonts)** - Font optimization
- **[@nuxt/image](https://nuxt.com/modules/image)** - Image optimization

## 🎨 Design System

Spacer uses a comprehensive design token system for consistency:

- **Colors** - Primary, semantic, and neutral palettes
- **Spacing** - Consistent spacing scale
- **Typography** - Font families, sizes, and weights
- **Shadows** - Elevation system
- **Animations** - Smooth transitions

See `app/config/design-tokens.ts` for the complete design system.

## 🧪 Development

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format
npm run format
```

### Adding New Features

1. **Define Types** in `app/types/`
2. **Create Composable** for logic in `app/composables/`
3. **Build Components** in `app/components/`
4. **Update Design Tokens** if needed
5. **Wire Everything** in pages

## 📝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Nuxt 4](https://nuxt.com/)
- Icons by [Material Symbols](https://fonts.google.com/icons)
- Inspired by tools like Figma and Notion

## 🔗 Links

- **Repository**: [github.com/labpaw/spcr](https://github.com/labpaw/spcr)
- **Issues**: [Report a bug](https://github.com/labpaw/spcr/issues)
- **Documentation**: [Architecture Guide](ARCHITECTURE.md)

---

Made with ❤️ by the Spacer team
