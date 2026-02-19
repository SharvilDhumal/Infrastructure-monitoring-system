import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import BridgeMap from "../components/BridgeComponents/BridgeMap";
import AlertPanel from "../components/BridgeComponents/AlertPanel";
import AIDetectionPanel from "../components/BridgeComponents/AIDetectionPanel";

// Mock data generators
const generateVibrationData = () => {
  const data = [];
  for (let i = 0; i < 48; i++) {
    data.push({
      time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${String((i % 2) * 30).padStart(2, "0")}`,
      vibration: 5.2 + Math.random() * 3.5,
      threshold: 8.5,
    });
  }
  return data;
};

const generateStrainData = () => {
  const data = [];
  for (let i = 0; i < 48; i++) {
    data.push({
      time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${String((i % 2) * 30).padStart(2, "0")}`,
      strain: 32 + Math.random() * 25,
      safeLimit: 60,
    });
  }
  return data;
};

const generateLoadData = () => {
  return [
    { section: "North Pier", load: 1245, capacity: 1500, percentage: 83 },
    { section: "Mid Span", load: 1380, capacity: 1600, percentage: 86 },
    { section: "South Pier", load: 1210, capacity: 1500, percentage: 81 },
    { section: "East Deck", load: 950, capacity: 1200, percentage: 79 },
    { section: "West Deck", load: 1020, capacity: 1200, percentage: 85 },
  ];
};

const generatePredictiveData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const trend = 2 + i * 0.15;
    data.push({
      day: `Day ${i + 1}`,
      failureRisk: Math.min(100, trend + Math.random() * 5),
      safeZone: 20,
    });
  }
  return data;
};

const Bridge = () => {
  const [bridgeStatus, setBridgeStatus] = useState("Safe");
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [lastInspection, setLastInspection] = useState("2026-02-19 14:32 UTC");
  const [structuralHealth, setStructuralHealth] = useState(87);

  const vibrationData = generateVibrationData();
  const strainData = generateStrainData();
  const loadData = generateLoadData();
  const predictiveData = generatePredictiveData();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["Safe", "Warning", "Critical"];
      const randomStatus = statuses[Math.floor(Math.random() * 3)];
      // Most of the time it should be Safe
      if (Math.random() > 0.2) {
        setBridgeStatus("Safe");
      } else {
        setBridgeStatus(randomStatus);
      }
      setStructuralHealth(Math.max(65, 87 + Math.random() * 10 - 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Safe":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle,
        };
      case "Warning":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: AlertTriangle,
        };
      case "Critical":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const statusConfig = getStatusColor(bridgeStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Global Status */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bridge Structural Health Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Control Panel – Real-Time Infrastructure Assessment
          </p>
        </div>

        {/* Header Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Global Status */}
          <div
            className={`${statusConfig.bg} ${statusConfig.border} rounded-lg border-2 p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Global Bridge Status
                </p>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
                  <span className={`text-2xl font-bold ${statusConfig.text}`}>
                    {bridgeStatus}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              All systems monitored
            </p>
          </div>

          {/* Last Inspection */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Last Inspection
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {lastInspection}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time monitoring active
            </p>
          </div>

          {/* Active Alerts */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Active Alerts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {activeAlerts}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Requires attention
            </p>
          </div>

          {/* Structural Health Score */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg border border-blue-200 dark:border-blue-700 p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-200 mb-2">
              Health Score (AI)
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {Math.round(structuralHealth)}%
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Above threshold
            </p>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Avg Vibration Level",
              value: "6.8",
              unit: "Hz",
              status: "normal",
              threshold: "8.5 Hz",
            },
            {
              label: "Strain Load",
              value: "48.3",
              unit: "%",
              status: "normal",
              threshold: "60% max",
            },
            {
              label: "Tilt Angle",
              value: "0.32",
              unit: "°",
              status: "normal",
              threshold: "0.5° max",
            },
            {
              label: "Avg Load vs Capacity",
              value: "83",
              unit: "%",
              status: "good",
              threshold: "80-90% optimal",
            },
            {
              label: "Temperature",
              value: "24.5",
              unit: "°C",
              status: "normal",
              threshold: "20-30°C",
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                {kpi.label}
              </p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {kpi.unit}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Threshold: {kpi.threshold}
                </span>
                <div
                  className={`h-2 w-2 rounded-full ${
                    kpi.status === "normal"
                      ? "bg-green-500"
                      : kpi.status === "good"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Vibration Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded"></span>
              Vibration Trend (24-Hour)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={vibrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  name="Vibration (Hz)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  name="Max Threshold (8.5 Hz)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Strain Variation */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-green-600 rounded"></span>
              Strain Variation (24-Hour)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={strainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="strain"
                  name="Strain (%)"
                  stroke="#10b981"
                  fill="#d1fae5"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="safeLimit"
                  name="Safe Limit (60%)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section - Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Load Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded"></span>
              Load Distribution by Section
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="section"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  style={{ fontSize: "11px" }}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="load" fill="#8b5cf6" name="Current Load (kN)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Predictive Failure Risk */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-indigo-600" />
              Predictive Failure Risk Forecast (30-Day)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  style={{ fontSize: "11px" }}
                  interval={4}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="failureRisk"
                  name="Predicted Risk (%)"
                  stroke="#ef4444"
                  fill="#fee2e2"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="safeZone"
                  name="Safe Zone (%)"
                  stroke="#10b981"
                  fill="#d1fae5"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bridge Map & Alert Panel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bridge Map - Takes 2 columns */}
          <div className="lg:col-span-2">
            <BridgeMap />
          </div>

          {/* Active Alerts Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Recent Alerts
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[
                {
                  severity: "High",
                  sensor: "Vibro-01",
                  time: "14:32",
                  message: "High vibration detected",
                },
                {
                  severity: "Medium",
                  sensor: "Strain-03",
                  time: "14:28",
                  message: "Strain increase trend",
                },
                {
                  severity: "Low",
                  sensor: "Tilt-02",
                  time: "14:15",
                  message: "Minor tilt variance",
                },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    alert.severity === "High"
                      ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800"
                      : alert.severity === "Medium"
                        ? "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800"
                        : "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        alert.severity === "High"
                          ? "text-red-700 dark:text-red-200"
                          : alert.severity === "Medium"
                            ? "text-yellow-700 dark:text-yellow-200"
                            : "text-blue-700 dark:text-blue-200"
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sensor: {alert.sensor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sections - Alert Panel & AI Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Panel */}
          <AlertPanel />

          {/* AI Detection Panel */}
          <AIDetectionPanel />
        </div>
      </div>
    </div>
  );
};

export default Bridge;
