import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import './WorkoutTracker.css'

const WORKOUT_TYPES = [
  'Running', 'Walking', 'Cycling', 'Swimming', 'Yoga',
  'Pilates', 'Strength', 'HIIT', 'Dance', 'Other'
]

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([])
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [type, setType] = useState('Running')
  const [duration, setDuration] = useState('')
  const [miles, setMiles] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchWorkouts() }, [])

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
    if (!error) setWorkouts(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!duration) return
    setSaving(true)
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        date,
        type,
        duration_minutes: parseInt(duration),
        miles: miles ? parseFloat(miles) : null,
        notes
      }])
      .select()
    if (!error) {
      setWorkouts(prev => [data[0], ...prev])
      setDuration('')
      setMiles('')
      setNotes('')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id)
    if (!error) setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  const weeklyWorkouts = workouts.filter(w => {
    const d = new Date(w.date)
    const now = new Date()
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff <= 7
  })

  const totalMinutes = weeklyWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0)
  const totalMiles = weeklyWorkouts.reduce((sum, w) => sum + (w.miles || 0), 0)

  return (
    <div className="workout-tracker">
      <div className="tracker-grid">
        <div className="tracker-card">
          <div className="tracker-card-title">Log a workout</div>

          <div className="tracker-field">
            <label className="tracker-label">Date</label>
            <input type="date" className="tracker-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Type</label>
            <select className="tracker-input" value={type} onChange={e => setType(e.target.value)}>
              {WORKOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Duration (minutes)</label>
            <input
              type="number"
              className="tracker-input"
              placeholder="e.g. 30"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Distance (miles, optional)</label>
            <input
              type="number"
              step="0.1"
              className="tracker-input"
              placeholder="e.g. 3.2"
              value={miles}
              onChange={e => setMiles(e.target.value)}
            />
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Notes (optional)</label>
            <input
              type="text"
              className="tracker-input"
              placeholder="e.g. felt great, outdoor run"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="tracker-save-btn" onClick={handleSave} disabled={saving || !duration}>
            {saving ? 'Saving...' : 'Log workout'}
          </button>

          <div className="workout-stats-row">
            <div className="workout-stat">
              <span className="workout-stat-number">{totalMinutes}</span>
              <span className="workout-stat-label">minutes this week</span>
            </div>
            {totalMiles > 0 && (
              <>
                <div className="workout-stat-divider" />
                <div className="workout-stat">
                  <span className="workout-stat-number">{totalMiles.toFixed(1)}</span>
                  <span className="workout-stat-label">miles this week</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="tracker-card">
          <div className="tracker-card-title">Recent workouts</div>
          {loading && <div className="tracker-loading">Loading...</div>}
          {!loading && workouts.length === 0 && (
            <div className="tracker-empty">No workouts logged yet — get moving!</div>
          )}
          <div className="workout-list">
            {workouts.slice(0, 10).map(w => (
              <div key={w.id} className="workout-row">
                <div className="workout-row-info">
                  <span className="workout-type">{w.type}</span>
                  <span className="workout-date">{format(parseISO(w.date), 'EEE, MMM d')}</span>
                  {w.notes && <span className="workout-notes">{w.notes}</span>}
                </div>
                <div className="workout-row-right">
                  <span className="workout-duration">
                    {w.duration_minutes} min
                    {w.miles ? ` · ${w.miles} mi` : ''}
                  </span>
                  <button className="tracker-delete-btn" onClick={() => handleDelete(w.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}