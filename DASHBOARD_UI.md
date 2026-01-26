# RootPharma Dashboard Design System

This document outlines the UI/UX architecture and design patterns used in the RootPharma React dashboard.

## Aesthetics & Theme

The dashboard follows a "Modern Bio-Terminal" aesthetic, characterized by:
- **Primary Color Palette**: Deep Space Blue (`#0f172a`), Emerald Green (`#10b981`), and Slate Gray (`#1e293b`).
- **Typography**: Clean, sans-serif fonts with monospace accents for blockchain identifiers.
- **Visual Effects**: Glassmorphism (backdrop-blur), subtle micro-animations (fade-in, hover scales), and high-contrast status indicators.

## Component Architecture

### [Web3Context.jsx](dashboard/src/context/Web3Context.jsx)
The core provider that handles:
- Ethers.js integration.
- Contract instance initialization with ABI/Address mapping.
- Wallet connection state and event listeners.

### [DashboardLayout.jsx](dashboard/src/components/layout/DashboardLayout.jsx)
The wrapper component providing:
- Sidebar navigation.
- Header with network status and wallet button.
- Responsive container for role-specific routes.

## Role-Specific Hubs

1. **Manufacturer Hub**: High-density data for production line management and batch minting.
2. **Clinical Portal (Doctor)**: Streamlined patient search and secure Rx signing.
3. **Dispensary Hub (Pharmacy)**: Real-time inventory tracking and on-chain verification.
4. **Health Portfolio (Patient)**: Visualization of personal medical history and reward balances.
5. **Surveillance Hub (Auditor)**: Network-wide monitoring tools and emergency recall triggers.

## Responsive Strategy

The dashboard utilizes a custom Vanilla CSS grid system and Flexbox layouts, ensuring complete functionality from small tablet screens to high-resolution desktop monitors.
- **Breakpoints**: 768px (Mobile/Tablet transition), 1024px (Lg/Desktop).
