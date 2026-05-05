import React from 'react'
import { LayoutDashboard, MessageCircle, CheckSquare, Sparkles, FolderOpen, Bell, Heart, Lock, LockOpen, BookOpen } from 'lucide-react'
import { useLock } from '../PrivateLock.jsx'
import './Sidebar.css'

const PRIVATE_PAGES = new Set(['health', 'files'])

const NAV = [
  { id: 'daily', label: 'Today', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'health', label: 'Health', icon: Heart, private: true },
  { id: 'files', label: 'Files', icon: FolderOpen, private: true },
  { id: 'poets', label: "Poet's Corner", icon: BookOpen },
]

export default function Sidebar({ page, setPage, tasks }) {
  const { unlocked, lock } = useLock()
  const pending = tasks.filter(t => !t.done).length
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const handleNavClick = (id) => {
    // Always allow navigation — PasswordGate handles locking on the page itself
    setPage(id)
  }

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
        {NAV.map(({ id, label, icon: Icon, private: isPrivate }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => handleNavClick(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {id === 'tasks' && pending > 0 && (
              <span className="nav-badge">{pending}</span>
            )}
            {isPrivate && (
              <span className="nav-lock-icon" title={unlocked ? 'Private (unlocked)' : 'Private'}>
                {unlocked ? <LockOpen size={12} /> : <Lock size={12} />}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {unlocked && (
          <button className="lock-btn" onClick={lock} title="Lock private pages">
            <Lock size={13} />
            Lock private pages
          </button>
        )}
        <div className="api-note">Powered by Claude API</div>
        <div className="api-hint">Add your key in <code>anthropic.js</code></div>
      </div>
    </aside>
  )
}
