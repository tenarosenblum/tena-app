import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { Plus, Circle, CheckCircle2, Trash2 } from 'lucide-react'
import './RemindersPage.css'

const IMPORTANCE = [
  { id: 'urgent', label: 'Urgent', color: 'var(--terracotta)', bg: 'var(--terracotta-light)' },
  { id: 'medium', label: 'Medium', color: 'var(--amber)', bg: 'var(--amber-light)' },
  { id: 'low', label: 'Low', color: 'var(--sage)', bg: 'var(--sage-light)' },
]

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [newText, setNewText] = useState('')
  const [newImportance, setNewImportance] = useState('medium')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setReminders(data || [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newText.trim()) return
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ text: newText.trim(), importance: newImportance, done: false }])
      .select()
    if (!error) {
      setReminders(prev => [data[0], ...prev])
      setNewText('')
    }
  }

  const toggleReminder = async (id, done) => {
    const { error } = await supabase
      .from('reminders')
      .update({ done: !done })
      .eq('id', id)
    if (!error) setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !done } : r))
  }

  const deleteReminder = async (id) => {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
    if (!error) setReminders(prev => prev.filter(r => r.id !== id))
  }

  const pending = reminders.filter(r => !r.done).length

  return (
    <div className="reminders-page">
      <header className="reminders-header">
        <div>
          <h1 className="reminders-title">Reminders</h1>
          <p className="reminders-sub">{pending} remaining</p>
        </div>
      </header>

      <div className="add-reminder-card">
        <input
          className="add-reminder-input"
          type="text"
          placeholder="Add a reminder..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <div className="add-reminder-controls">
          <div className="importance-selector">
            {IMPORTANCE.map(imp => (
              <button
                key={imp.id}
                className={`importance-btn ${newImportance === imp.id ? 'active' : ''}`}
                style={newImportance === imp.id ? { background: imp.bg, color: imp.color, borderColor: imp.color } : {}}
                onClick={() => setNewImportance(imp.id)}
              >
                {imp.label}
              </button>
            ))}
          </div>
          <button className="add-reminder-btn" onClick={handleAdd}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {loading && <div className="reminders-loading">Loading...</div>}

      <div className="reminders-list">
        {reminders.length === 0 && !loading && (
          <div className="reminders-empty">No reminders yet — add one above!</div>
        )}
        {IMPORTANCE.map(imp => {
          const items = reminders.filter(r => r.importance === imp.id)
          if (items.length === 0) return null
          return (
            <div key={imp.id} className="reminders-group">
              <div className="reminders-group-label" style={{ color: imp.color }}>
                <span className="group-dot" style={{ background: imp.color }} />
                {imp.label}
              </div>
              {items.map(reminder => (
                <div key={reminder.id} className={`reminder-item ${reminder.done ? 'done' : ''}`}>
                  <button className="reminder-toggle" onClick={() => toggleReminder(reminder.id, reminder.done)}>
                    {reminder.done
                      ? <CheckCircle2 size={18} color="var(--sage)" />
                      : <Circle size={18} color="var(--ink-faint)" />
                    }
                  </button>
                  <span className="reminder-text">{reminder.text}</span>
                  <button className="reminder-delete" onClick={() => deleteReminder(reminder.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}