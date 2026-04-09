import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, parseISO } from 'date-fns'
import './MoodTracker.css'

const MOODS = [
  { id: 'great', label: 'Great', color: '#FFFF00', bg: '#FAFADC' },
  { id: 'good', label: 'Good', color: '#2AAA8A', bg: '#E6EDE7' },
  { id: 'okay', label: 'Okay', color: '#FF82EC', bg: '#f2d9de' },
  { id: 'tired', label: 'Tired', color: '#3A6A7A', bg: '#d9ebf2' },
  { id: 'anxious', label: 'Anxious', color: '#6A5A9A', bg: '#e2daf2' },
  { id: 'overwhelmed', label: 'Overwhelmed', color: '#C9614A', bg: '#F5E8E4' },
]

export default function MoodTracker({ initialMood = null }) {
  const [logs, setLogs] = useState([])
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [mood, setMood] = useState(initialMood || '')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('mood_logs')
      .select('*')
      .order('date', { ascending: false })
    if (data) setLogs(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!mood) return
    setSaving(true)
    const { data, error } = await supabase
      .from('mood_logs')
      .upsert([{ date, mood, notes }], { onConflict: 'date' })
      .select()
    if (!error) {
      setLogs(prev => {
        const filtered = prev.filter(l => l.date !== date)
        return [data[0], ...filtered].sort((a, b) => b.date.localeCompare(a.date))
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      setNotes('')
    }
    setSaving(false)
  }

  const selectedMood = MOODS.find(m => m.id === mood)

  return (
    <div className="mood-tracker">
      <div className="mood-grid">
        <div className="tracker-card">
          <div className="tracker-card-title">How are you feeling?</div>

          <div className="tracker-field">
            <label className="tracker-label">Date</label>
            <input
              type="date"
              className="tracker-input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="mood-selector">
            {MOODS.map(m => (
              <button
                key={m.id}
                className={`mood-option ${mood === m.id ? 'active' : ''}`}
                style={mood === m.id ? { background: m.bg, borderColor: m.color, color: m.color } : {}}
                onClick={() => setMood(m.id)}
              >
                <span className="mood-option-label">{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mood-selected-display" style={{ background: selectedMood.bg, color: selectedMood.color }}>
              Feeling {selectedMood.label.toLowerCase()} today
            </div>
          )}

          <div className="tracker-field" style={{ marginTop: '16px' }}>
            <label className="tracker-label">Notes (optional)</label>
            <textarea
              className="tracker-input mood-notes"
              placeholder="What's on your mind today?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <button
            className="tracker-save-btn mood-save-btn"
            onClick={handleSave}
            disabled={saving || !mood}
          >
            {success ? 'Saved!' : saving ? 'Saving...' : 'Log mood'}
          </button>
        </div>

        <div className="tracker-card">
          <div className="tracker-card-title">Mood history</div>
          {loading && <div className="tracker-loading">Loading...</div>}
          {!loading && logs.length === 0 && (
            <div className="tracker-empty">No moods logged yet — start today!</div>
          )}
          <div className="mood-log-list">
            {logs.slice(0, 14).map(log => {
              const m = MOODS.find(m => m.id === log.mood)
              return (
                <div key={log.id} className="mood-log-row">
                  <div className="mood-log-info">
                    <div className="mood-log-top">
                      <span className="mood-log-label" style={{ color: m?.color }}>{m?.label}</span>
                      <span className="mood-log-date">{format(parseISO(log.date), 'EEE, MMM d')}</span>
                    </div>
                    {log.notes && <span className="mood-log-notes">{log.notes}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}