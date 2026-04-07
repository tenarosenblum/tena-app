import React from 'react'
import { LayoutDashboard, MessageCircle, CheckSquare, Sparkles, FolderOpen } from 'lucide-react'
import './Sidebar.css'

const NAV = [
  { id: 'daily', label: 'Today', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'files', label: 'Files', icon: FolderOpen },
]

export default function Sidebar({ page, setPage, tasks }) {
  const pending = tasks.filter(t => !t.done).length
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="brand-name">Tena</div>
          <div className="brand-sub">your assistant</div>
        </div>
      </div>

      <div className="sidebar-greeting">
        <div className="greeting-text">{greeting}</div>
        <div className="greeting-sub">{pending} things on your list</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {id === 'tasks' && pending > 0 && (
              <span className="nav-badge">{pending}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="api-note">
          Powered by Claude API
        </div>
        <div className="api-hint">Add your key in <code>anthropic.js</code></div>
      </div>
    </aside>
  )
}
