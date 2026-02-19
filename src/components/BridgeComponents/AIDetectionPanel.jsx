import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Zap } from "lucide-react";

const AIDetectionPanel = () => {
  const [detectionResults] = useState({
    crackDetection: {
      imageUrl:
        "https://via.placeholder.com/400x250/1f2937/ffffff?text=CCTV+Feed:+Bridge+Deck+Analysis",
      confidence: 87,
      findings: "Minor surface cracks detected in western cable anchorage area",
      crackLength: "0-25mm",
      severity: "Low",
      location: "Western cable anchorage, elevation +8.2m",
      recommendation:
        "Monitor quarterly. Minor maintenance recommended within 6 months.",
    },
    droneAnalysis: {
      status: "Completed",
      timestamp: "2026-02-17 10:15:00",
      coverage: "95%",
      imageUrl:
        "https://via.placeholder.com/400x250/1f2937/ffffff?text=Drone+Survey:+Deck+View",
      findings:
        "Overall structural integrity maintained. Minor surface wear observed.",
      aiConfidence: 92,
    },
    maintenanceRecommendation: {
      urgency: "Medium",
      estimatedCost: "$45,000",
      timeline: "6-12 months",
      tasks: [
        "Inspect and repair surface cracks in cable anchorage",
        "Replace 3 expansion joints showing wear",
        "Recalibrate 2 vibration sensors",
        "Clean and recoat protective layer on deck surface",
        "Verify bearing system lubrication",
      ],
    },
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-100";
      case "Medium":
        return "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-100";
      case "High":
        return "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-700 dark:text-red-100";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-indigo-600" />
        AI Detection & Maintenance Panel
      </h3>

      {/* Crack Detection Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          Crack Detection (CCTV Feed)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* CCTV Image Preview */}
          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg h-40 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-slate-600">
            <img
              src={detectionResults.crackDetection.imageUrl}
              alt="CCTV Feed"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detection Details */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                AI Confidence Score
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{
                      width: `${detectionResults.crackDetection.confidence}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {detectionResults.crackDetection.confidence}%
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded px-3 py-2">
              <p className="text-xs text-blue-700 dark:text-blue-100 font-medium mb-1">
                Findings:
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-200">
                {detectionResults.crackDetection.findings}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 dark:bg-slate-700 rounded p-2">
                <p className="text-gray-600 dark:text-gray-400">Crack Length</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {detectionResults.crackDetection.crackLength}
                </p>
              </div>
              <div
                className={`${getSeverityColor(detectionResults.crackDetection.severity)} border rounded p-2`}
              >
                <p className="text-xs opacity-75">Severity</p>
                <p className="font-semibold">
                  {detectionResults.crackDetection.severity}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-xs">
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
            Location:
          </p>
          <p className="text-gray-800 dark:text-gray-200 font-mono">
            {detectionResults.crackDetection.location}
          </p>
        </div>
      </div>

      {/* Drone Analysis Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          Drone Survey Analysis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drone Image */}
          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg h-40 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-slate-600">
            <img
              src={detectionResults.droneAnalysis.imageUrl}
              alt="Drone Survey"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Analysis Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-green-700 dark:text-green-100">
                Status
              </span>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />
                <span className="text-xs font-bold text-green-700 dark:text-green-100">
                  {detectionResults.droneAnalysis.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 dark:bg-slate-700 rounded p-2">
                <p className="text-gray-600 dark:text-gray-400">Coverage</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {detectionResults.droneAnalysis.coverage}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded p-2">
                <p className="text-gray-600 dark:text-gray-400">
                  AI Confidence
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {detectionResults.droneAnalysis.aiConfidence}%
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded px-3 py-2">
              <p className="text-xs text-indigo-700 dark:text-indigo-100 font-medium mb-1">
                Analysis:
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-200">
                {detectionResults.droneAnalysis.findings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Recommendation Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            AI-Generated Maintenance Plan
          </h4>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              detectionResults.maintenanceRecommendation.urgency === "Medium"
                ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                : "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100"
            }`}
          >
            {detectionResults.maintenanceRecommendation.urgency} Priority
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
          <div className="bg-gray-50 dark:bg-slate-700 rounded p-3">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Est. Cost</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {detectionResults.maintenanceRecommendation.estimatedCost}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded p-3">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Timeline</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {detectionResults.maintenanceRecommendation.timeline}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded p-3">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Tasks</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {detectionResults.maintenanceRecommendation.tasks.length} items
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Recommended Tasks:
          </p>
          <ul className="space-y-1.5">
            {detectionResults.maintenanceRecommendation.tasks.map(
              (task, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 text-xs text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{task}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIDetectionPanel;
