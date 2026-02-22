import { useState, useEffect } from 'react';
import './App.css';
import {
  LayoutDashboard,
  CheckCircle,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  User,
  X,
  Calendar,
  Activity,
  Zap,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [detections, setDetections] = useState([]);
  const [activeSection, setActiveSection] = useState('unsolved');
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [solverName, setSolverName] = useState('');
  const [resolveTime, setResolveTime] = useState('');

  // -------------------- Extract Image Name --------------------
  const getImageName = (path) => {
    return path.split("/").pop();
  };

  // -------------------- Fetch Issues --------------------
  const fetchDetections = async () => {
    try {
      const response = await fetch("http://localhost:8000/detections/");
      const data = await response.json();
      setDetections(data);
    } catch (error) {
      console.error("Error fetching detections:", error);
    }
  };

  useEffect(() => {
    fetchDetections();
    const interval = setInterval(fetchDetections, 5000);
    return () => clearInterval(interval);
  }, []);

  // -------------------- Submit Solve --------------------
  const submitSolve = async () => {
    if (!solverName || !resolveTime) {
      alert("Please enter solver name and resolved time.");
      return;
    }

    try {
      await fetch(`http://localhost:8000/solve/${selectedIssueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          solver_name: solverName,
          resolved_time: resolveTime
        })
      });

      closeModal();
      fetchDetections();
    } catch (error) {
      console.error("Error solving issue:", error);
    }
  };

  const closeModal = () => {
    setSelectedIssueId(null);
    setSolverName('');
    setResolveTime('');
  };

  // -------------------- Auto PDF Report --------------------
  const generatePDF = () => {
    try {
      // Initialize jsPDF
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();

      // Title
      doc.setFontSize(20);
      doc.text("Infravision - Pothole Detection Report", 14, 22);

      doc.setFontSize(11);
      doc.text(`Generated: ${date}`, 14, 30);
      doc.text(`Total Issues: ${detections.length}`, 14, 36);

      // Table Data
      const tableColumn = ["ID", "Status", "Confidence", "Detected At", "Solved By", "Resolved At"];
      const tableRows = [];

      detections.forEach(ticket => {
        const ticketData = [
          ticket.id,
          ticket.status.toUpperCase(),
          `${(ticket.confidence * 100).toFixed(1)}%`,
          formatDate(ticket.time),
          ticket.solver_name || "-",
          ticket.resolved_time ? ticket.resolved_time.replace('T', ' ') : "-"
        ];
        tableRows.push(ticketData);
      });

      // Generate Table using functional approach
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [6, 182, 212] } // Cyan color
      });

      doc.save(`Infravision_Report_${date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  // -------------------- Derived State --------------------
  const unsolvedIssues = detections.filter(item => item.status === "unsolved");
  const solvedIssues = detections.filter(item => item.status === "solved");

  // Helper for date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.replace('_', ' ').replace(/(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5');
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Zap size={24} color="#06b6d4" fill="#06b6d4" />
          INFRA<span style={{ color: '#06b6d4' }}>VISION</span>
        </div>
        <ul className="nav-list">
          <li
            className={`nav-item ${activeSection === 'unsolved' ? 'active' : ''}`}
            onClick={() => setActiveSection('unsolved')}
          >
            <AlertTriangle size={18} />
            Live Alerts
            {unsolvedIssues.length > 0 && <span style={{ marginLeft: 'auto', fontSize: '0.8em', color: '#ef4444' }}>●</span>}
          </li>
          <li
            className={`nav-item ${activeSection === 'solved' ? 'active' : ''}`}
            onClick={() => setActiveSection('solved')}
          >
            <CheckCircle size={18} />
            Resolved
          </li>
          <li
            className={`nav-item ${activeSection === 'report' ? 'active' : ''}`}
            onClick={() => setActiveSection('report')}
          >
            <FileText size={18} />
            Reports
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="breadcrumb">
            Smart Infrastructure • Road Network
          </div>
          <h1 className="page-title">Real-time Pothole Detection</h1>
          <p className="page-subtitle">Live camera feed analysis and maintenance tracking dashboard.</p>
        </header>

        {/* System Status Bar */}
        <div className="status-bar">
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            System Online • Monitoring Active
          </div>
          <div className="status-meta">
            Gateway: <strong>CONNECTED</strong> • Last Packet: <strong>JUST NOW</strong>
          </div>
        </div>

        {/* Unsolved */}
        {activeSection === 'unsolved' && (
          <section className="animate-fade-in">
            {unsolvedIssues.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} color="#10b981" />
                <p>All clear. No detected hazards.</p>
              </div>
            ) : (
              <div className="issue-grid">
                {unsolvedIssues.map(item => (
                  <div key={item.id} className="issue-card">
                    <div className="card-image-wrapper">
                      <img
                        src={`http://localhost:8000/${item.image}`}
                        alt="Pothole"
                        className="card-image"
                        onError={(e) => e.target.src = 'https://placehold.co/600x400/0f172a/FFF?text=No+Image'}
                      />
                      <div className="status-badge unsolved">
                        <AlertTriangle size={14} /> Critical
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <div className="issue-id">ID: {item.id}</div>
                        <div className="confidence-wrapper">
                          <div className="confidence-display">{(item.confidence * 100).toFixed(0)}<span style={{ fontSize: '0.5em' }}>%</span></div>
                          <span className="confidence-label">Confidence</span>
                        </div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-row">
                          <MapPin size={16} className="icon-muted" />
                          <span>Sector 4 - Main Rd</span>
                        </div>
                        <div className="meta-row">
                          <Clock size={16} className="icon-muted" />
                          <span>{formatDate(item.time)}</span>
                        </div>
                      </div>

                      <button className="resolve-btn" onClick={() => setSelectedIssueId(item.id)}>
                        Resolve Issue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Solved */}
        {activeSection === 'solved' && (
          <section className="animate-fade-in">
            {solvedIssues.length === 0 ? (
              <div className="empty-state">
                <LayoutDashboard size={48} color="#64748b" />
                <p>No maintenance history available.</p>
              </div>
            ) : (
              <div className="issue-grid">
                {solvedIssues.map(item => (
                  <div key={item.id} className="issue-card">
                    <div className="card-image-wrapper">
                      <img
                        src={`http://localhost:8000/${item.image}`}
                        alt="Pothole"
                        className="card-image"
                        onError={(e) => e.target.src = 'https://placehold.co/600x400/0f172a/FFF?text=No+Image'}
                      />
                      <div className="status-badge solved">
                        <CheckCircle size={14} /> Resolved
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <div className="issue-id">ID: {item.id}</div>
                        <div className="confidence-wrapper">
                          <div className="confidence-display" style={{ color: '#10b981' }}>100<span style={{ fontSize: '0.5em' }}>%</span></div>
                          <span className="confidence-label">Fixed</span>
                        </div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-row">
                          <User size={16} className="icon-muted" />
                          <span>Fixed by <strong>{item.solver_name}</strong></span>
                        </div>
                        <div className="meta-row">
                          <Calendar size={16} className="icon-muted" />
                          <span>{item.resolved_time.replace('T', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Monthly Report - ENHANCED */}
        {activeSection === 'report' && (
          <section className="animate-fade-in">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Issues Detected</div>
                <div className="stat-value">{detections.length}</div>
                <Activity size={48} className="stat-icon" color="#3b82f6" />
              </div>
              <div className="stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="stat-title">Resolved Issues</div>
                <div className="stat-value" style={{ color: '#10b981' }}>{solvedIssues.length}</div>
                <CheckCircle size={48} className="stat-icon" color="#10b981" />
              </div>
              <div className="stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <div className="stat-title">Pending Action</div>
                <div className="stat-value" style={{ color: '#ef4444' }}>{unsolvedIssues.length}</div>
                <AlertTriangle size={48} className="stat-icon" color="#ef4444" />
              </div>
            </div>

            {/* Detailed Table */}
            <div className="table-container">
              <div className="report-header">
                <h2 className="report-title">Detailed Detection Log</h2>
                <button className="download-btn" onClick={generatePDF}>
                  <Download size={18} /> Download PDF Report
                </button>
              </div>

              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Confidence</th>
                    <th>Detected At</th>
                    <th>Resolved By</th>
                  </tr>
                </thead>
                <tbody>
                  {detections.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <span className={`status-cell ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{(item.confidence * 100).toFixed(1)}%</td>
                      <td>{formatDate(item.time)}</td>
                      <td>{item.solver_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal Overlay */}
      {selectedIssueId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Resolution</h3>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Maintenance Personnel</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter ID or Name"
                value={solverName}
                onChange={(e) => setSolverName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Completion Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={resolveTime}
                onChange={(e) => setResolveTime(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#fff' }} onClick={closeModal}>Cancel</button>
              <button className="btn-primary" style={{ background: '#06b6d4', color: '#000' }} onClick={submitSolve}>Confirm Fix</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
