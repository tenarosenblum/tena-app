import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format } from 'date-fns'
import './WaterTracker.css'

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0)
  const [goal, setGoal] = useState(8)
  const [loading, setLoading] = useState(true)
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => { fetchToday() }, [])

  const fetchToday = async () => {
    const { data } = await supabase
      .from('water_logs')
      .select('*')
      .eq('date', today)
      .single()
    if (data) {
      setGlasses(data.glasses)
      setGoal(data.goal)
    }
    setLoading(false)
  }

  const updateWater = async (newGlasses) => {
    if (newGlasses < 0) return
    setGlasses(newGlasses)
    await supabase
      .from('water_logs')
      .upsert([{ date: today, glasses: newGlasses, goal }], { onConflict: 'date' })
  }

  const pct = Math.min((glasses / goal) * 100, 100)

  return (
    <div className="water-tracker">
      <div className="water-card">
        <div className="water-header">
          <div className="tracker-card-title">Water intake</div>
          <div className="water-goal-edit">
            <label className="tracker-label">Daily goal</label>
            <select
              className="water-goal-select"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
            >
              {[6,7,8,9,10,11,12].map(n => (
                <option key={n} value={n}>{n} glasses</option>
              ))}
            </select>
          </div>
        </div>

        <div className="water-display">
          <div className="water-glasses-grid">
            {Array.from({ length: goal }, (_, i) => (
              <button
                key={i}
                className={`water-glass ${i < glasses ? 'filled' : ''}`}
                onClick={() => updateWater(i < glasses ? i : i + 1)}
              >
                <svg viewBox="0 0 24 32" width="28" height="36">
                  <path d="M4 4 L6 28 Q6 30 12 30 Q18 30 18 28 L20 4 Z" fill={i < glasses ? '#5B7899' : 'none'} stroke={i < glasses ? '#5B7899' : 'var(--ink-faint)'} strokeWidth="1.5"/>
                </svg>
              </button>
            ))}
          </div>

          <div className="water-stats">
            <div className="water-big-number">
              <span className="water-count">{glasses}</span>
              <span className="water-total">/ {goal}</span>
            </div>
            <div className="water-oz">{glasses * 8} oz today</div>
            <div className="water-progress-bar">
              <div className="water-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="water-pct">{Math.round(pct)}% of goal</div>
          </div>
        </div>

        <div className="water-controls">
          <button className="water-btn minus" onClick={() => updateWater(glasses - 1)} disabled={glasses === 0}>
            − Remove glass
          </button>
          <button className="water-btn plus" onClick={() => updateWater(glasses + 1)} disabled={glasses >= goal}>
            + Add glass
          </button>
        </div>

        {glasses >= goal && (
          <div className="water-congrats">You hit your water goal today!</div>
        )}
      </div>
    </div>
  )
}