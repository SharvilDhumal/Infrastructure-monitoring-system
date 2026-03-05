import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./LiveDetectionMap.css";
import { fetchAllIssues } from "../services/issuesService";

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Swallow map errors and show fallback to avoid blank screen
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="leaflet-fallback">
          Map unavailable right now. Please retry in a moment.
        </div>
      );
    }
    return this.props.children;
  }
}

// Vite-compatible Leaflet icon fix
const iconUrl = new URL("leaflet/dist/images/marker-icon.png", import.meta.url)
  .href;
const iconRetinaUrl = new URL(
  "leaflet/dist/images/marker-icon-2x.png",
  import.meta.url
).href;
const shadowUrl = new URL(
  "leaflet/dist/images/marker-shadow.png",
  import.meta.url
).href;

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const LiveDetectionMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [canRender, setCanRender] = useState(true);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // IMPORTANT FIX: prevents white screen during SSR hydration
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined" || typeof document === "undefined") {
      setCanRender(false);
    }
  }, []);

  useEffect(() => {
    if (isMounted && canRender) {
      const loadIssues = async () => {
        try {
          const issues = await fetchAllIssues();
          // Show all issues regardless of status on the map
          setAllIssues(issues);
        } catch (error) {
          console.error('Error loading issues for map:', error);
        } finally {
          setLoading(false);
        }
      };
      loadIssues();
    }
  }, [isMounted, canRender]);

  if (!isMounted || !canRender) return null;

  // Filter only unassigned and assigned issues (not resolved) for the map
  const activeIssues = allIssues.filter(issue => issue.status !== 'resolved');

  return (
    <div className="live-map-card">
      <div className="card-header">
        <h2 className="card-title">Live Detection Map – India</h2>
        <span className="card-badge">{loading ? '...' : activeIssues.length} Active</span>
      </div>

      <div className="leaflet-wrapper">
        {!loading && (
          <MapErrorBoundary>
            <MapContainer
              center={[22.9734, 78.6569]} // India center
              zoom={5}
              scrollWheelZoom
              className="leaflet-map"
              style={{ minHeight: "340px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                crossOrigin=""
              />

              {activeIssues.map((issue) => (
                <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                  <Popup>
                    <strong>{issue.type}</strong> <br />
                    Severity: {issue.severity} <br />
                    Status: {issue.status} <br />
                    Location: {issue.location} <br />
                    Confidence: {issue.aiConfidence}% <br />
                    Time: {issue.detectionTime}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </MapErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default LiveDetectionMap;
