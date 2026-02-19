# Infravision.AI Dashboard

A professional, admin-grade multi-page dashboard for an AI-powered infrastructure monitoring system. Built with React using a clean, reusable component-based architecture.

## Pages

### Overview (Command Center)
The core command center featuring:
- **ContextHeader**: Wide city/zone map view with semi-transparent status chips (overall health, active alerts, AI status, last scan)
- **Critical Issues – Action Required**: Image-based issue cards with severity, AI confidence, location, and quick actions
- **AI Insights Panel**: Textual AI explanations of detected patterns, risks, and optimizations
- **Operations & Task Control**: Assigned, unassigned, overdue issues with workflow indicator (detected → verified → assigned → fixed)
- **Compact Infrastructure Health**: Snapshot of roads, street lights, water systems, and bridges
- **Recent Activity Timeline**: Chronological feed of system activities

### Infrastructure Monitoring
Asset-wise views with detailed monitoring:
- Tab-based navigation for Roads, Street Lights, Water Systems, and Bridges
- Health metrics and statistics per asset type
- Recent issues table with filtering and actions
- Visual health indicators

### AI Analysis
Advanced AI insights and pattern recognition:
- Detailed AI insights with recommendations
- Model performance metrics
- Analysis history tracking
- Pattern detection and risk assessment

### Incidents & Maintenance
Comprehensive incident management:
- Status-based filtering (detected, verified, assigned, in-progress, completed, scheduled)
- Detailed incident cards with workflow actions
- Assignment tracking and resolution estimates
- Maintenance scheduling

### Analytics
Performance metrics and trends:
- Key performance indicators
- Issue trends visualization
- Asset health breakdown
- Top issue types analysis
- Resolution efficiency metrics
- AI performance tracking

### Settings
System configuration and management:
- AI configuration options
- Notification preferences
- User management
- API keys and integrations
- System maintenance controls

## Design System

- **Sidebar**: Light pastel green (#E7F5D6)
- **Main Background**: Off-white (#F6F8F7)
- **Cards**: Pure white (#FFFFFF) with soft shadows and rounded corners
- **Text**: Dark gray (#1F2933) for clarity
- **Accent Colors**:
  - Green (#22C55E) for healthy status
  - Amber (#F59E0B) for warnings
  - Red (#EF4444) for critical alerts

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Quick Start

1. **Install dependencies** (required first step):
```bash
npm install
```
This will install all required packages including React, Vite, and React Router.

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
The server will start and display a local URL (typically `http://localhost:5173` or `http://localhost:3000`). Open this URL in your browser.

### Important Notes

- **Always run `npm install` first** before running any commands
- **Use `npm run dev`** (not `vite` directly) to start the development server
- The server will automatically reload when you make changes to the code

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory. To preview the production build:

```bash
npm run preview
```

### Troubleshooting

**"vite is not recognized" error:**
- Make sure you've run `npm install` first
- Use `npm run dev` instead of running `vite` directly
- Ensure Node.js is installed: `node --version`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ContextHeader.jsx
│   ├── CriticalIssuesList.jsx
│   ├── AIInsightsPanel.jsx
│   ├── OperationsPanel.jsx
│   ├── CompactInfrastructureHealth.jsx
│   ├── RecentActivityTimeline.jsx
│   └── Sidebar.jsx
├── pages/              # Page components
│   ├── Overview.jsx
│   ├── InfrastructureMonitoring.jsx
│   ├── AIAnalysis.jsx
│   ├── IncidentsMaintenance.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Technologies Used

- React 18
- React Router DOM (for multi-page navigation)
- Vite (build tool)
- CSS3 (with CSS Variables for theming)

## License

MIT

