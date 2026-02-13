import React, { useState } from 'react'
import './Settings.css'

const Settings = () => {
  const [settings, setSettings] = useState({
    aiEnabled: true,
    autoAssignment: true,
    emailNotifications: true,
    smsAlerts: false,
    scanFrequency: 'hourly',
    alertThreshold: 'medium',
    maintenanceMode: false
  })

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure system preferences and notifications</p>
      </div>

      <div className="settings-sections">
        <SettingsSection title="AI Configuration">
          <SettingItem
            label="AI Monitoring Enabled"
            description="Enable AI-powered infrastructure monitoring and analysis"
            type="toggle"
            value={settings.aiEnabled}
            onChange={() => handleToggle('aiEnabled')}
          />
          <SettingItem
            label="Auto Assignment"
            description="Automatically assign detected issues to available teams"
            type="toggle"
            value={settings.autoAssignment}
            onChange={() => handleToggle('autoAssignment')}
          />
          <SettingItem
            label="Scan Frequency"
            description="How often the system performs infrastructure scans"
            type="select"
            value={settings.scanFrequency}
            options={[
              { value: 'realtime', label: 'Real-time' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' }
            ]}
            onChange={(value) => handleSelectChange('scanFrequency', value)}
          />
          <SettingItem
            label="Alert Threshold"
            description="Minimum severity level for triggering alerts"
            type="select"
            value={settings.alertThreshold}
            options={[
              { value: 'low', label: 'Low (All issues)' },
              { value: 'medium', label: 'Medium (Warning and above)' },
              { value: 'high', label: 'High (Critical only)' }
            ]}
            onChange={(value) => handleSelectChange('alertThreshold', value)}
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingItem
            label="Email Notifications"
            description="Receive email alerts for critical issues and system updates"
            type="toggle"
            value={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
          <SettingItem
            label="SMS Alerts"
            description="Receive SMS alerts for critical infrastructure issues"
            type="toggle"
            value={settings.smsAlerts}
            onChange={() => handleToggle('smsAlerts')}
          />
        </SettingsSection>

        <SettingsSection title="System">
          <SettingItem
            label="Maintenance Mode"
            description="Enable maintenance mode to pause automated operations"
            type="toggle"
            value={settings.maintenanceMode}
            onChange={() => handleToggle('maintenanceMode')}
            warning={settings.maintenanceMode}
          />
        </SettingsSection>

        <SettingsSection title="User Management">
          <div className="users-list">
            <UserItem name="John Doe" email="john.doe@infravision.ai" role="Administrator" />
            <UserItem name="Jane Smith" email="jane.smith@infravision.ai" role="Operator" />
            <UserItem name="Mike Johnson" email="mike.johnson@infravision.ai" role="Viewer" />
          </div>
          <button className="add-user-btn">Add New User</button>
        </SettingsSection>

        <SettingsSection title="API & Integrations">
          <div className="api-section">
            <div className="api-key">
              <div className="api-key-label">API Key</div>
              <div className="api-key-value">sk_live_••••••••••••••••••••••••</div>
              <button className="api-action-btn">Regenerate</button>
            </div>
            <div className="integrations-list">
              <IntegrationItem name="Slack" enabled={true} />
              <IntegrationItem name="Microsoft Teams" enabled={false} />
              <IntegrationItem name="Webhook" enabled={true} />
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="settings-actions">
        <button className="save-btn">Save Changes</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  )
}

const SettingsSection = ({ title, children }) => {
  return (
    <div className="settings-section">
      <h2 className="section-title">{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </div>
  )
}

const SettingItem = ({ label, description, type, value, onChange, options, warning }) => {
  return (
    <div className={`setting-item ${warning ? 'warning' : ''}`}>
      <div className="setting-info">
        <div className="setting-label">{label}</div>
        <div className="setting-description">{description}</div>
      </div>
      <div className="setting-control">
        {type === 'toggle' && (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={value}
              onChange={onChange}
            />
            <span className="toggle-slider"></span>
          </label>
        )}
        {type === 'select' && (
          <select
            className="setting-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

const UserItem = ({ name, email, role }) => {
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'administrator':
        return 'var(--accent-red)'
      case 'operator':
        return 'var(--accent-amber)'
      case 'viewer':
        return 'var(--accent-green)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="user-item">
      <div className="user-avatar">{name.charAt(0)}</div>
      <div className="user-info">
        <div className="user-name">{name}</div>
        <div className="user-email">{email}</div>
      </div>
      <div className="user-role" style={{ backgroundColor: `${getRoleColor(role)}20`, color: getRoleColor(role) }}>
        {role}
      </div>
      <button className="user-action-btn">Edit</button>
    </div>
  )
}

const IntegrationItem = ({ name, enabled }) => {
  return (
    <div className="integration-item">
      <div className="integration-name">{name}</div>
      <label className="toggle-switch small">
        <input type="checkbox" checked={enabled} readOnly />
        <span className="toggle-slider"></span>
      </label>
    </div>
  )
}

export default Settings































