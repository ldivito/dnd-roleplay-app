# RolApp - D&D Dungeon Master Management System

> A comprehensive D&D 5e Dungeon Master management application built with Next.js and TypeScript.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)

## 🎲 Key Features

### 🎮 Session Management

- **Main Dashboard**: Centralized control panel for DMs
- **Live Session**: Real-time tools for active sessions
- **Time Tracking**: Session timer and time management
- **State Management**: Automatic persistence of session data

### ⚔️ Combat System

- **Initiative Tracker**: Automatic combat order tracking
- **HP/AC Management**: Health points and armor class control
- **Effects and Conditions**: System for tracking combat conditions
- **Combat History**: Detailed encounter logging

### 👥 Character & NPC Management

- **Character Sheets**: Complete player character management
- **NPC Database**: Non-player character organization
- **Relationship System**: Connections between NPCs and factions
- **Importance Levels**: NPC classification by relevance

### 🗺️ World & Locations

- **Map System**: Visual location management
- **Location Hierarchy**: Organization of continents, regions, cities
- **Map Editor**: Tools for creating and editing maps
- **Interactive Navigation**: Visual world exploration

### 📋 Quests & Story

- **Quest System**: Objective creation and tracking
- **Event Timeline**: Campaign chronology
- **Lore Management**: World history, legends, and knowledge
- **Campaign Notes**: Flexible story documentation

### 📚 Compendium

- **Spell Library**: Complete spell database
- **Item Inventory**: Equipment and magic item management
- **Search System**: Advanced filters for finding content
- **Custom Objects**: Creation of unique spells and items

### 🎵 Music Spell System

- **Bard Spells**: Specialized system for magical music
- **Performance Effects**: Unique interpretation mechanics
- **Repertoire Management**: Musical piece organization

### 🎲 Dice Tools

- **Dice Simulator**: Automatic rolls with multiple types
- **Roll History**: Previous result logging
- **Custom Dice**: Specific roll configuration

### 📅 Calendar System

- **Custom Calendar**: Game world temporal system
- **Events and Dates**: Campaign temporal planning
- **Flexible Configuration**: Adaptable to different worlds

### 🏛️ Faction Management

- **Organizations**: Guilds, kingdoms, cults and more
- **Power Relations**: Dynamics between factions
- **Influence and Territory**: Geographic and political control

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.4.4** - Full-stack React framework
- **React 18** - User interface library
- **TypeScript 5** - Static typing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible interface components
- **Lucide React** - Modern iconography

### State & Data

- **Zustand** - Global state management
- **IndexedDB** - Browser local storage
- **React Hook Form** - Form management
- **Zod** - TypeScript schema validation

### Development Tools

- **Vitest** - Testing framework
- **ESLint & Prettier** - Code linting and formatting
- **Husky & Lint-staged** - Git hooks and automation
- **Commitizen** - Conventional commits

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm or bun

### Installation Steps

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd RolApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Run production version
npm run lint         # Run linter
npm run lint:fix     # Auto-fix linting issues

# Formatting
npm run format       # Format code with Prettier
npm run format:check # Check formatting

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Git
npm run commit       # Create commit with Commitizen
```

## 🏗️ Project Structure

```
RolApp/
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── calendar/          # Calendar system
│   │   ├── characters/        # Character management
│   │   ├── combat/            # Combat system
│   │   ├── compendium/        # Content library
│   │   ├── dice/              # Dice tools
│   │   ├── factions/          # Faction management
│   │   ├── lore/              # History and lore
│   │   ├── maps/              # Map system
│   │   ├── notes/             # Campaign notes
│   │   ├── npcs/              # NPCs
│   │   ├── quests/            # Quest system
│   │   ├── session/           # Active session
│   │   └── settings/          # Configuration
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   └── [Feature]*.tsx    # Feature-specific components
│   ├── lib/                   # Utilities and helpers
│   ├── stores/                # Global state (Zustand)
│   ├── types/                 # TypeScript definitions
│   └── __tests__/            # Test files
├── public/                    # Static files
└── docs/                      # Additional documentation
```

## 📊 Key Features

### 💾 Data Persistence

- Automatic storage in IndexedDB
- Backup and recovery system
- Real-time state synchronization

### 🎨 User Interface

- Dark theme optimized for long sessions
- Responsive design for tablets and mobile devices
- Accessible components and keyboard navigation
- Intuitive and consistent iconography

### ⚡ Performance

- Lazy component loading
- Bundle optimization with Next.js
- Efficient state management
- Local persistence for offline access

### 🛡️ Code Quality

- Strict TypeScript for type safety
- Automated tests with Vitest
- Automatic linting and formatting
- Git hooks for consistent quality

## 🧪 Testing

```bash
# Run all tests
npm run test

# Tests with coverage
npm run test:coverage

# Tests in CI mode
npm run test:run
```

## 📱 Application Usage

### First Time Setup

1. Open the application in your browser
2. Create a new campaign from the main panel
3. Configure your world calendar (optional)
4. Add initial characters, NPCs and locations
5. Start your first session!

### Session Management

- Use the **Dashboard** as command center
- Start sessions from **Active Session**
- Track combat with the **Combat System**
- Take real-time notes

### Content Organization

- Organize locations hierarchically in **Maps**
- Manage NPC relationships in **NPCs**
- Connect historical events in **Lore**
- Track story progress in **Quests**

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`npm run commit`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript conventions
- Use Prettier for formatting
- Write tests for new functionality
- Document complex functions and components

## 📄 License

This project is under the MIT License. See `LICENSE` for more details.

---

## 🎯 Roadmap

- [ ] Campaign import/export system
- [ ] Multiplayer mode for players
- [ ] D&D Beyond API integration
- [ ] Adventure template system
- [ ] Automatic encounter generator
- [ ] Complete offline mode
- [ ] Plugin system for extensibility

---

**Happy adventuring!** 🐉✨
