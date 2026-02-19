import React, { useState } from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const AlertPanel = () => {
  const [alerts] = useState([
    {
      id: 1,
      severity: "Critical",
      sensorId: "Vibro-01",
      timestamp: "2026-02-19 14:32:45",
      anomaly: "Excessive vibration detected",
      recommendation:
        "Reduce traffic load immediately. Inspect bearing systems.",
      value: "9.2 Hz",
      threshold: "8.5 Hz",
    },
    {
      id: 2,
      severity: "High",
      sensorId: "Strain-03",
      timestamp: "2026-02-19 14:28:12",
      anomaly: "Strain increase trend observed",
      recommendation: "Monitor cable tension. Schedule structural inspection.",
      value: "65%",
      threshold: "60%",
    },
    {
      id: 3,
      severity: "Medium",
      sensorId: "Load-02",
      timestamp: "2026-02-19 14:15:33",
      anomaly: "Load approaching safe limit",
      recommendation:
        "Implement traffic management. Check weight distribution.",
      value: "1450 kN",
      threshold: "1500 kN",
    },
    {
      id: 4,
      severity: "Low",
      sensorId: "Tilt-02",
      timestamp: "2026-02-19 13:52:18",
      anomaly: "Minor tilt variance detected",
      recommendation: "Continue monitoring. No immediate action required.",
      value: "0.38°",
      threshold: "0.5°",
    },
    {
      id: 5,
      severity: "Low",
      sensorId: "Temp-01",
      timestamp: "2026-02-19 13:45:00",
      anomaly: "Temperature stabilized",
      recommendation: "Normal operation. Continue routine monitoring.",
      value: "24.5°C",
      threshold: "30°C",
    },
  ]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "Critical":
        return {
          bg: "bg-red-50 dark:bg-red-900",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-200",
          icon: AlertCircle,
          badge: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100",
        };
      case "High":
        return {
          bg: "bg-orange-50 dark:bg-orange-900",
          border: "border-orange-200 dark:border-orange-800",
          text: "text-orange-700 dark:text-orange-200",
          icon: AlertTriangle,
          badge:
            "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100",
        };
      case "Medium":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-200",
          icon: AlertTriangle,
          badge:
            "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100",
        };
      case "Low":
        return {
          bg: "bg-blue-50 dark:bg-blue-900",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-200",
          icon: Info,
          badge:
            "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-800",
          border: "border-gray-200 dark:border-gray-700",
          text: "text-gray-700 dark:text-gray-200",
          icon: Info,
          badge:
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded"></span>
        Anomaly Alert Panel
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          const IconComponent = styles.icon;

          return (
            <div
              key={alert.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer`}
            >
              <div className="flex gap-3">
                <IconComponent
                  className={`w-5 h-5 ${styles.text} flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${styles.badge} px-2 py-0.5 rounded`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className={`text-sm font-medium ${styles.text} mb-2`}>
                    {alert.anomaly}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                    <div className="bg-white dark:bg-slate-700 rounded px-2 py-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Sensor ID
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {alert.sensorId}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded px-2 py-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Reading / Threshold
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {alert.value} / {alert.threshold}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-700 rounded px-2 py-1 text-xs">
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                      Recommended Action:
                    </p>
                    <p className="text-gray-800 dark:text-gray-200">
                      {alert.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{alerts.length}</span> active
          alerts • Last update: Now
        </p>
      </div>
    </div>
  );
};

export default AlertPanel;
