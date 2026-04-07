import React, { useState } from 'react'
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react'
import './TasksPage.css'

const CATEGORIES = [
  { id: 'family', label: 'Family', bg: 'var(--terracotta-light)', color: 'var(--terracotta-dark)' },
  { id: 'work', label: 'Work', bg: 'var(--dusty-blue-light)', color: 'var(--dusty-blue)' },
  { id: 'self', label: 'Self-care', bg: 'var(--sage-light)', color: 'var(--sage)' },
  { id: 'home', label: 'Home', bg: 'var(--amber-light)', color: 'var(--amber)' },
  { id: 'finance', label: 'Finance', bg: 'var(--lavender-light)', color: 'var(--lavender)' },
]

const PRIORITIES = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export default function TasksPage({ tasks, addTask, toggleTask, deleteTask }) {
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('family')
  const [newPriority, setNewPriority] = useState('medium')
  const [filter, setFilter] = useState('all')

  const handleAdd = () => {
    if (!newText.trim()) return
    addTask({ text: newText.trim(), category: newCat, priority: newPriority })
    setNewText('')
  }

  const filtered = filter === 'all' ? tasks
    : filter === 'done' ? tasks.filter(t => t.done)
    : tasks.filter(t => !t.done && t.category === filter)

  const pending = tasks.filter(t => !t.done).length

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-sub">{pending} remaining · {tasks.filter(t => t.done).length} done</p>
        </div>
      </header>

      <div className="add-task-card">
        <input
          className="add-task-input"
          type="text"
          placeholder="Add a new task..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <div className="add-task-controls">
          <select
            className="add-select"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select
            className="add-select"
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
          >
            {PRIORITIES.map(p => (
              <option key={p.id} value={p.id}>{p.label} priority</option>
            ))}
          </select>
          <button className="add-task-btn" onClick={handleAdd}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="filter-row">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-btn ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')}>Done</button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`filter-btn ${filter === c.id ? 'active' : ''}`}
            style={filter === c.id ? { background: c.bg, color: c.color, borderColor: c.color } : {}}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filtered.length === 0 && (
          <div className="empty-state">No tasks here — enjoy the quiet moment.</div>
        )}
        {filtered.map(task => {
          const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[0]
          return (
            <div key={task.id} className={`task-card ${task.done ? 'done' : ''} priority-${task.priority}`}>
              <button className="task-toggle" onClick={() => toggleTask(task.id)}>
                {task.done
                  ? <CheckCircle2 size={20} color="var(--sage)" />
                  : <Circle size={20} color="var(--ink-faint)" />
                }
              </button>
              <div className="task-info">
                <span className="task-text">{task.text}</span>
                <div className="task-meta">
                  <span className="cat-pill" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
                  <span className="priority-dot" data-priority={task.priority} />
                  <span className="priority-label">{task.priority}</span>
                </div>
              </div>
              <button className="task-delete" onClick={() => deleteTask(task.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
