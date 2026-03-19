import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Server, Activity, AlertTriangle, Users, BarChart3, Settings } from 'lucide-react'

const Sidebar = ({ collapsed }) => {
  return (
    <aside className={`fixed left-6 top-24 bottom-12 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col z-50 overflow-y-auto hide-scrollbar transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${collapsed ? '-translate-x-[120%]' : 'translate-x-0'}`}>
      <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">IMS <span className="text-blue-600">Admin</span></h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Infrastructure Hub</p>
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
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <item.icon size={18} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
