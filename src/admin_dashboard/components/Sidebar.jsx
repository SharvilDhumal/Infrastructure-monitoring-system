import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Server, Activity, AlertTriangle, Users, BarChart3, Settings, X } from 'lucide-react'

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 lg:left-6 lg:top-24 lg:bottom-12 lg:w-64 bg-white/95 backdrop-blur-xl border-r lg:border border-slate-200 lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col z-[70] lg:z-50 overflow-y-auto hide-scrollbar transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${collapsed && !mobileOpen ? 'lg:-translate-x-[120%]' : ''}`}>
        
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">IMS <span className="text-blue-600">Admin</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Infrastructure Hub</p>
            </div>
            <button className="lg:hidden p-2 text-slate-500 rounded-lg touch-target" onClick={() => setMobileOpen(false)}>
                <X size={20} />
            </button>
        </div>
        
        <nav className="flex-1 py-4 px-4 space-y-1.5">
        {[
          { path: "/main-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
          { path: "/main-dashboard/infrastructure", label: "Assets", icon: Server },
          { path: "/main-dashboard/live-monitoring", label: "Monitoring", icon: Activity },
          { path: "/main-dashboard/incidents", label: "Incidents", icon: AlertTriangle },
          { path: "/main-dashboard/user-issues", label: "Public Reports", icon: Users },
          { path: "/main-dashboard/analytics", label: "Analytics", icon: BarChart3 },
          { path: "/main-dashboard/settings", label: "Settings", icon: Settings }
        ].map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm touch-target ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <item.icon size={18} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  )
}

export default Sidebar
