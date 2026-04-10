import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import './FoodTracker.css'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function FoodTracker() {
  const [logs, setLogs] = useState([])
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [mealType, setMealType] = useState('Breakfast')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setLogs(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('food_logs')
      .insert([{ date, meal_type: mealType, name: name.trim(), notes }])
      .select()
    if (!error) {
      setLogs(prev => [data[0], ...prev])
      setName('')
      setNotes('')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('food_logs').delete().eq('id', id)
    if (!error) setLogs(prev => prev.filter(l => l.id !== id))
  }

  const todayLogs = logs.filter(l => l.date === format(new Date(), 'yyyy-MM-dd'))

  return (
    <div className="food-tracker">
      <div className="tracker-grid">
        <div className="tracker-card">
          <div className="tracker-card-title">Log a meal</div>

          <div className="tracker-field">
            <label className="tracker-label">Date</label>
            <input type="date" className="tracker-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Meal</label>
            <div className="meal-type-selector">
              {Object.entries(
  logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = []
    acc[log.date].push(log)
    return acc
  }, {})
)
.sort(([a], [b]) => b.localeCompare(a))
.slice(0, 7)
.map(([date, entries]) => (
  <div key={date} className="food-group">
    <div className="food-group-label">{format(parseISO(date), 'EEEE, MMM d')}</div>
    {MEAL_TYPES.map(meal => {
      const items = entries.filter(l => l.meal_type === meal)
      if (items.length === 0) return null
      return (
        <div key={meal} className="food-meal-section">
          <div className="food-meal-type">{meal}</div>
          {items.map(log => (
            <div key={log.id} className="food-row">
              <div className="food-row-info">
                <span className="food-name">{log.name}</span>
                {log.notes && <span className="food-notes">{log.notes}</span>}
              </div>
              <button className="tracker-delete-btn" onClick={() => handleDelete(log.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )
    })}
  </div>
))}
            </div>
          </div>

          <div className="tracker-field">
            <label className="tracker-label">What did you eat?</label>
            <input
              type="text"
              className="tracker-input"
              placeholder="e.g. oatmeal with berries"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="tracker-field">
            <label className="tracker-label">Notes (optional)</label>
            <input
              type="text"
              className="tracker-input"
              placeholder="e.g. felt full, ate slowly"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="tracker-save-btn food-save-btn" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Saving...' : 'Log meal'}
          </button>

          <div className="food-today-count">
            <span className="food-count-number">{todayLogs.length}</span>
            <span className="food-count-label">meals logged today</span>
          </div>
        </div>

        <div className="tracker-card">
          <div className="tracker-card-title">Food log</div>
          {loading && <div className="tracker-loading">Loading...</div>}
          {!loading && logs.length === 0 && (
            <div className="tracker-empty">No meals logged yet!</div>
          )}
          {MEAL_TYPES.map(meal => {
            const items = logs.filter(l => l.meal_type === meal).slice(0, 5)
            if (items.length === 0) return null
            return (
              <div key={meal} className="food-group">
                <div className="food-group-label">{meal}</div>
                {items.map(log => (
                  <div key={log.id} className="food-row">
                    <div className="food-row-info">
                      <span className="food-name">{log.name}</span>
                      <span className="food-date">{format(parseISO(log.date), 'MMM d')}</span>
                      {log.notes && <span className="food-notes">{log.notes}</span>}
                    </div>
                    <button className="tracker-delete-btn" onClick={() => handleDelete(log.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}