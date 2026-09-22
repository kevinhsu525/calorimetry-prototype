# Calorimetry Prototype - Design Document

## Overview

A medical calorimetry monitoring UI prototype based on Figma design specifications.

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| --cal-dark | #141415 | Primary background |
| --cal-card | #202324 | Card/container background |
| --cal-border | #373b3d | Borders, dividers |
| --cal-text | #f9f9fa | Primary text |
| --cal-text-secondary | #babdc0 | Secondary text, labels |
| --cal-accent | #b39cf1 | Accent color, waveforms |
| --cal-accent-bright | #be77f3 | Highlighted elements |
| --cal-grid | #525457 | Grid lines |
| --cal-button-bg | #61587f | Selected button background |

### Typography

- **Font Family**: Source Sans 3
- **Title**: 24px / Bold
- **Subtitle**: 22px / Regular
- **Body**: 18px / Regular
- **Label**: 14px / Regular
- **Value Display**: 30px / Regular

### Layout

- **Container**: max-width 1200px, centered
- **Left Panel**: 571px fixed width
- **Right Panel**: 274px fixed width
- **Gap**: 16px between panels
- **Padding**: 24px
- **Border Radius**: 1px (minimal)

## Components

### 1. Header
- Title: "Calorimetry"
- Close button (X icon)
- Height: 68px

### 2. Time Range Buttons
- Options: 30 min, 1 h, 2 h, 3 h, 6 h
- Selected state: bg-[#61587f]
- Default state: bg-[#373b3d]

### 3. Chart
- Title block: parameter name + unit
- Y-axis labels: min, mid, max values
- Grid: vertical and horizontal lines
- Waveform: SVG path with accent color
- X-axis labels: time stamps

### 4. Readings Panel
- Value pairs with divider
- Label + Value + Unit format
- Sections separated by horizontal dividers

### 5. Time Range Picker
- Highlighted range with semi-transparent background
- Start/end handles
- Draggable (UI only, no functionality)

### 6. Spinbox
- Left/right arrow buttons
- Center value display
- Border style matching design system

## Interaction States

### Buttons
- **Default**: bg-[#373b3d], text-[#babdc0]
- **Hover**: bg-[#4a4e50]
- **Active/Selected**: bg-[#61587f], text-[#fafbfd], font-bold
- **Disabled**: opacity 0.5

### Close Button
- **Default**: transparent
- **Hover**: bg-[#373b3d]

## Responsive Considerations

This prototype is designed for desktop/tablet viewport. The layout uses fixed widths for precision matching the Figma design.
