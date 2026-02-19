import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BridgeMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on a sample bridge location
    mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 15);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Bridge endpoints
    const bridgeStart = [51.505, -0.093];
    const bridgeEnd = [51.505, -0.087];

    // Draw bridge line
    L.polyline([bridgeStart, bridgeEnd], {
      color: "#1f2937",
      weight: 8,
      opacity: 0.8,
    }).addTo(mapInstance.current);

    // Sensor positions with different stress levels
    const sensors = [
      {
        coords: [51.5054, -0.0912],
        id: "Vibro-01",
        type: "Vibration",
        stress: 0.8,
        status: "Normal",
      },
      {
        coords: [51.5052, -0.0908],
        id: "Strain-03",
        type: "Strain",
        stress: 0.6,
        status: "Warning",
      },
      {
        coords: [51.505, -0.09],
        id: "Load-02",
        type: "Load Cell",
        stress: 0.5,
        status: "Normal",
      },
      {
        coords: [51.5048, -0.0892],
        id: "Tilt-02",
        type: "Inclinometer",
        stress: 0.3,
        status: "Normal",
      },
      {
        coords: [51.5046, -0.0884],
        id: "Temp-01",
        type: "Temperature",
        stress: 0.2,
        status: "Normal",
      },
    ];

    // Add stress heatmap circles around sensors
    sensors.forEach((sensor) => {
      const getStressColor = (stress) => {
        if (stress > 0.7) return "#ef4444";
        if (stress > 0.4) return "#f59e0b";
        return "#10b981";
      };

      // Add background gradient circle
      L.circle(sensor.coords, {
        radius: 400,
        color: getStressColor(sensor.stress),
        weight: 0,
        fillColor: getStressColor(sensor.stress),
        fillOpacity: 0.15,
      }).addTo(mapInstance.current);

      // Add medium circle
      L.circle(sensor.coords, {
        radius: 250,
        color: getStressColor(sensor.stress),
        weight: 0,
        fillColor: getStressColor(sensor.stress),
        fillOpacity: 0.25,
      }).addTo(mapInstance.current);
    });

    // Add sensor markers with custom icons and colors based on stress
    sensors.forEach((sensor) => {
      const color =
        sensor.stress > 0.7
          ? "#ef4444"
          : sensor.stress > 0.4
            ? "#f59e0b"
            : "#10b981";
      const iconHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg" style="background-color: ${color};">
          <span class="text-xs font-bold text-white">●</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [32, 32],
        popupAnchor: [0, -16],
      });

      const marker = L.marker(sensor.coords, { icon: customIcon }).addTo(
        mapInstance.current,
      );

      marker.bindPopup(`
        <div class="p-3 rounded-lg">
          <p class="font-bold text-gray-900">${sensor.id}</p>
          <p class="text-sm text-gray-600">Type: ${sensor.type}</p>
          <p class="text-sm text-gray-600">Status: <span class="font-semibold ${sensor.status === "Warning" ? "text-yellow-600" : "text-green-600"}">${sensor.status}</span></p>
          <p class="text-sm text-gray-600">Stress: ${Math.round(sensor.stress * 100)}%</p>
        </div>
      `);
    });

    // Add north arrow and scale
    L.control.scale({ position: "bottomright" }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm overflow-hidden">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-indigo-600 rounded"></span>
        Bridge Location & Sensor Network (GIS View)
      </h3>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-200 dark:border-slate-600"
        style={{ zIndex: 10 }}
      />
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {[
          { color: "#10b981", label: "Low Stress" },
          { color: "#f59e0b", label: "Medium Stress" },
          { color: "#ef4444", label: "High Stress" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BridgeMap;
