# Calorimetry Prototype

A React-based UI prototype for a medical calorimetry monitoring application.

## Overview

This project is a web-based UI prototype for a clinical calorimetry monitoring system, designed based on Figma specifications. It features a dark-themed interface with real-time data visualization components.

## Features

- **Time Range Selection**: Quick buttons for selecting time windows (30 min, 1h, 2h, 3h, 6h)
- **Real-time Charts**: Visualize MVexp, VCO2, VO2, RQ, and EE parameters
- **Statistical Readings**: Display average values and coefficients of variation
- **Time Range Picker**: Interactive slider for selecting specific time ranges
- **Spinbox Control**: Step through time ranges with navigation arrows

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Inline SVG

## Project Structure

```
CalorimetryPrototype/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Chart.tsx           # Waveform chart component
│   │   ├── Divider.tsx         # Divider component
│   │   ├── Header.tsx          # Application header
│   │   ├── Readings.tsx        # Statistical readings panel
│   │   ├── Spinbox.tsx         # Step input control
│   │   └── TimeRangeButtons.tsx # Time range selector
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite type declarations
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The development server runs at `http://localhost:5173` by default.

## Design Reference

Based on Figma design: [MCP-test-filght](https://www.figma.com/design/RyfvtSqxIMh73F6E5yai83/MCP-test-filght?node-id=78-1163&m=dev)

### Design System

- **Colors**:
  - Background: `#141415` (dark), `#202324` (card)
  - Text Primary: `#f9f9fa`
  - Text Secondary: `#babdc0`
  - Accent: `#b39cf1` / `#be77f3`
  - Border: `#373b3d`
  
- **Typography**: Source Sans 3
  - Title: 24px Bold
  - Subtitle: 22px Regular
  - Body: 18px Regular
  - Label: 14px Regular

## Version Management

This project uses Git for version control.

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Calorimetry Prototype UI"
```

## License

Private - For demonstration purposes only.
