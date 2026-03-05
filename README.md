# InfraVision: AI-Powered Smart City Infrastructure Monitoring System

Welcome to the **InfraVision** repository. This project is a comprehensive, end-to-end Smart City Infrastructure Management platform designed to bridge the gap between municipal authorities and citizens. By utilizing Artificial Intelligence, IoT integrations (simulated/real), and modern web technologies, InfraVision provides real-time monitoring and reporting capabilities for critical urban infrastructure.

---

## 📑 Table of Contents
1. [System Overview](#system-overview)
2. [Complete User Journey & Flows](#complete-user-journey--flows)
   - [1. The Landing Page](#1-the-landing-page)
   - [2. User Authentication (Registration & Login)](#2-user-authentication-registration--login)
   - [3. Citizen Reporting Flow (Report an Issue)](#3-citizen-reporting-flow-report-an-issue)
   - [4. The User Dashboard](#4-the-user-dashboard)
3. [Administrative & Live Monitoring Dashboard](#administrative--live-monitoring-dashboard)
4. [In-Depth Module Breakdown](#in-depth-module-breakdown)
   - [Module A: AI Pothole Detection](#module-a-ai-pothole-detection)
   - [Module B: Smart Streetlight Management](#module-b-smart-streetlight-management)
   - [Module C: Water Leakage Analytics](#module-c-water-leakage-analytics)
   - [Module D: Bridge Structural Health](#module-d-bridge-structural-health)
5. [Technology Stack](#technology-stack)

---

## 🏙️ System Overview

InfraVision operates on a dual-front approach:
1. **Citizen-Facing Portal**: Empowers everyday citizens to report infrastructure issues, track the status of their reports, and view overall city health.
2. **Authority/Admin Dashboard**: Provides municipal workers and city planners with a centralized command center to view live AI feeds, track sensor data across 4 specialized modules, and manage citizen reports.

---

## 🚶‍♂️ Complete User Journey & Flows

### 1. The Landing Page
**Purpose**: The gateway to the application, designed with a modern, clean, government-style aesthetic (white theme, high contrast, official blue accents).
* **Flow**:
  1. A user navigates to the base URL (`/`).
  2. The page displays the core value proposition of InfraVision: Smart City Monitoring.
  3. The navigation bar provides quick links to *Features*, *Modules*, *How It Works*, and *Contact*.
  4. Two main Call-to-Action (CTA) buttons are presented: **Login/Register** (for authentication) and **Report an Issue** (the primary citizen action).

### 2. User Authentication (Registration & Login)
**Purpose**: Securely identify citizens so they can track their specific reports and prevent spam.
* **Flow**:
  1. From the Landing Page or Navbar, the user clicks **Login**.
  2. If they are a new user, they navigate to the **Sign Up** page, providing their Name, Email, Password, and Phone Number.
  3. The backend validates the data, generates a securely hashed password, and creates the user profile in the database.
  4. Upon successful login, a JWT (JSON Web Token) is generated and stored in the browser's session storage.
  5. The UI updates dynamically—the "Login" button changes to a Profile icon displaying the user's initials.

### 3. Citizen Reporting Flow (Report an Issue)
**Purpose**: Allow citizens to act as the eyes and ears of the city.
* **Flow**:
  1. The authenticated user clicks **Report an Issue** in the navigation bar, taking them to `/report`.
  2. They are presented with a clean, official "Infrastructure Fault Report Form".
  3. **Data Collection**:
     - *Image Upload/Capture*: The user can drag-and-drop an image of the fault from their device or use the built-in **Webcam/Device Camera integration** to take a live photo.
     - *Fault Type*: The user selects from a dropdown of categorized issues (e.g., Road Damage, Streetlight Outage, Water Leak, Bridge Issue).
     - *Location*: The user inputs the specific street address or coordinates.
     - *Description*: A text area for detailed context.
  4. **Submission**: Upon clicking "Submit Official Report", the frontend sends a `POST` request to the backend with the user's JWT token.
  5. **Confirmation**: The form transitions into a Success State, displaying a completely white-themed confirmation screen informing the user that an incident tracking number has been generated.

### 4. The User Dashboard
**Purpose**: A personalized space for the citizen to track the lifecycle of their reported issues.
* **Flow**:
  1. By clicking their Profile Icon, the user navigates to their personal dashboard.
  2. The dashboard queries the backend (`/api/issues/user`) to fetch only the reports tied to their specific account ID.
  3. The interface displays a list/grid of their past reports, showing the submitted image, location, and the **Current Status** (e.g., *Pending, Investigating, Resolved*).
  4. This transparency builds trust between the city and its citizens, as they can see when a pothole they reported is finally patched.

---

## 🛂 Administrative & Live Monitoring Dashboard

While citizens use the main site, City Admins have access to the `/main-dashboard` (and `admin_dashboard` interface).

* **Sidebar Navigation**: Includes links to the Overview, Live Monitoring, Incidents (citizen reports), and Settings. It features a modern `Ctrl+B` toggle to collapse the sidebar for maximum screen real estate.
* **Notification System**: Admins receive real-time alerts. Clicking the bell icon opens a sleek Notification Drawer to quickly review urgent system warnings.
* **Managing Citizen Reports**: Admins can view a unified list of all issues reported via the public form and update their statuses (e.g., marking a reported streetlight outage as "Resolved").

---

## 🔍 In-Depth Module Breakdown

The heart of InfraVision lies in its **Live Monitoring** capabilities. The Admin Dashboard routes to 4 distinct, highly specialized modules.

### 1. AI Pothole Detection System
* **Purpose**: Real-time road surface analysis.
* **Flow & Functionality**:
  1. Admins open the Pothole Dashboard.
  2. The system integrates with (simulated) CCTV/Dashcam feeds mounted on public transport or city vehicles.
  3. A machine learning model processes the video feed frame-by-frame, placing bounding boxes over detected potholes or road degradation.
  4. The dashboard displays the **Live Detection Video**, alongside analytical charts showing the frequency and severity of potholes detected across different city zones.
  5. Critical detections automatically flag the exact geographic location on a map for the maintenance crew.

### 2. Smart Streetlight Management
* **Purpose**: Energy efficiency and automated fault detection for city lighting.
* **Flow & Functionality**:
  1. Admins open the Streetlight Dashboard.
  2. The interface presents a city map scattered with markers representing individual streetlights.
  3. **IoT Integration**: Each streetlight reports its current status (ON/OFF), power consumption, and bulb health.
  4. The system automatically highlights failing lights in red.
  5. Admins can view power usage graphs to identify energy spikes and can theoretically send commands to dim specific grid sectors during low-traffic hours to save energy.

### 3. Water Leakage Analytics
* **Purpose**: Preventing water waste and alerting authorities to pipe bursts before catastrophic failure.
* **Flow & Functionality**:
  1. Admins open the Water Leakage Dashboard.
  2. The system acts as an aggregator for IoT pressure sensors installed in the municipal water grid.
  3. The dashboard tracks Water Pressure (PSI) and Flow Rate metrics across different sectors.
  4. If a severe pressure drop is detected (indicating a leak or pipe burst), the system fires an urgent alert to the Notification Drawer.
  5. The analytics page provides historical data to predict pipeline deterioration before a failure occurs.

### 4. Bridge Structural Health Monitoring
* **Purpose**: Preventing catastrophic structural failures by utilizing AI to monitor surface cracks and rust propagation.
* **Flow & Functionality**:
  1. Admins open the Bridge Dashboard.
  2. The system integrates visual data from cameras and drones inspecting key bridge structures.
  3. The dashboard tracks real-time AI computer vision data:
     - **Crack Detection**: Using AI to identify and measure the length and severity of structural cracks.
     - **Rust & Corrosion Analysis**: Monitoring the spread of rust on critical metal supports and cables.
     - **Structural Fatigue**: Aggregating crack and rust data to calculate an overall health score.
  4. If danger thresholds are exceeded (e.g., rapid crack propagation or severe rust), the system immediately logs a critical warning, prompting an immediate physical engineering inspection.

---

## 💻 Technology Stack

* **Frontend**: React.js, Vite (for rapid build tooling), Tailwind CSS (for modern, responsive, and customizable styling), Framer Motion (for smooth animations), React Router DOM, Lucide React (Icons).
* **Backend**: Python (FastAPI/Uvicorn for the AI and data endpoints) and/or Node.js/Express (for authentication and standard API routing).
* **AI/ML**: Computer Vision logic utilized in the Pothole Detection module for bounding box rendering.
* **Data Visualization**: Charts and graphical representations built using React-compatible charting libraries.

---

*Built for a safer, smarter, and more efficient urban future.*
