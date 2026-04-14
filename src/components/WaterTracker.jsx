import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, subDays } from 'date-fns'
import './WaterTracker.css'

const TEA_ICON = ({ filled }) => (
  <svg viewBox="0 0 32 32" width="28" height="28">
    <path d="M6 10 L8 26 Q8 28 16 28 Q24 28 24 26 L26 10 Z"
      fill={filled ? '#A89B7B' : 'none'}
      stroke={filled ? '#A89B7B' : 'var(--ink-faint)'}
      strokeWidth="1.5" />
    <path d="M24 14 Q30 14 30 18 Q30 22 24 22"
      fill="none" stroke={filled ? '#A89B7B' : 'var(--ink-faint)'}
      strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 4 Q11 7 13 7 Q13 10 11 10" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M17 3 Q17 7 19 7 Q19 11 17 11" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const SODA_ICON = ({ filled }) => (
  <svg viewBox="0 0 24 36" width="22" height="32">
    <rect x="6" y="4" width="12" height="2" rx="1"
      fill={filled ? '#D4688A' : 'var(--ink-faint)'} />
    <rect x="4" y="6" width="16" height="26" rx="3"
      fill={filled ? '#D4688A' : 'none'}
      stroke={filled ? '#D4688A' : 'var(--ink-faint)'}
      strokeWidth="1.5" />
    {filled && <>
      <rect x="7" y="10" width="2" height="8" rx="1" fill="rgba(255,255,255,0.3)" />
    </>}
  </svg>
)

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0)
  const [goal, setGoal] = useState(8)
  const [teaCups, setTeaCups] = useState(0)
  const [sodaCans, setSodaCans] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    fetchToday()
    fetchHistory()
  }, [])

  const fetchToday = async () => {
    const { data } = await supabase
      .from('beverage_logs')
      .select('*')
      .eq('date', today)
      .single()
    if (data) {
      setGlasses(data.glasses ?? 0)
      setGoal(data.goal ?? 8)
      setTeaCups(data.tea_cups ?? 0)
      setSodaCans(data.soda_cans ?? 0)
    }
    setLoading(false)
  }

  const fetchHistory = async () => {
    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')
    const { data } = await supabase
      .from('beverage_logs')
      .select('*')
      .lt('date', today)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: false })
    if (data) setHistory(data)
  }

  const upsert = async (updates) => {
    await supabase
      .from('beverage_logs')
      .upsert([{ date: today, glasses, goal, tea_cups: teaCups, soda_cans: sodaCans, ...updates }], { onConflict: 'date' })
  }

  const updateWater = async (val) => {
    if (val < 0 || val > goal) return
    setGlasses(val)
    await upsert({ glasses: val })
  }

  const updateTea = async (val) => {
    if (val < 0) return
    setTeaCups(val)
    await upsert({ tea_cups: val })
  }

  const updateSoda = async (val) => {
    if (val < 0) return
    setSodaCans(val)
    await upsert({ soda_cans: val })
  }

  const pct = Math.min((glasses / goal) * 100, 100)

  if (loading) return <div className="water-tracker"><p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>Loading...</p></div>

  return (
    <div className="water-tracker">
      <div className="water-layout">

        {/* LEFT: main cards */}
        <div className="water-left">

          {/* Water main card */}
          <div className="water-card">
            <div className="water-header">
              <div className="tracker-card-title">Water intake</div>
              <div className="water-goal-edit">
                <label className="tracker-label">Daily goal</label>
                <select
                  className="water-goal-select"
                  value={goal}
                  onChange={e => { const g = Number(e.target.value); setGoal(g); upsert({ goal: g }) }}
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
                      <path d="M4 4 L6 28 Q6 30 12 30 Q18 30 18 28 L20 4 Z"
                        fill={i < glasses ? '#5B7899' : 'none'}
                        stroke={i < glasses ? '#5B7899' : 'var(--ink-faint)'}
                        strokeWidth="1.5" />
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
              <button className="water-btn minus" onClick={() => updateWater(glasses - 1)} disabled={glasses === 0}>− Remove glass</button>
              <button className="water-btn plus" onClick={() => updateWater(glasses + 1)} disabled={glasses >= goal}>+ Add glass</button>
            </div>

            {glasses >= goal && (
              <div className="water-congrats">You hit your water goal today! 💧</div>
            )}
          </div>

          {/* Tea + Soda small cards row */}
          <div className="bev-row">

            {/* Tea card */}
            <div className="bev-card tea-card">
              <div className="bev-card-title">Tea</div>
              <div className="bev-icons-row">
                {Array.from({ length: Math.max(teaCups, 4) }, (_, i) => (
                  <button
                    key={i}
                    className={`bev-icon-btn ${i < teaCups ? 'filled' : ''}`}
                    onClick={() => updateTea(i < teaCups ? i : i + 1)}
                  >
                    <TEA_ICON filled={i < teaCups} />
                  </button>
                ))}
              </div>
              <div className="bev-count">{teaCups} cup{teaCups !== 1 ? 's' : ''}</div>
              <div className="bev-controls">
                <button className="bev-btn minus" onClick={() => updateTea(teaCups - 1)} disabled={teaCups === 0}>−</button>
                <button className="bev-btn plus tea-plus" onClick={() => updateTea(teaCups + 1)}>+</button>
              </div>
            </div>

            {/* Soda card */}
            <div className="bev-card soda-card">
              <div className="bev-card-title">Soda</div>
              <div className="bev-icons-row">
                {Array.from({ length: Math.max(sodaCans, 4) }, (_, i) => (
                  <button
                    key={i}
                    className={`bev-icon-btn ${i < sodaCans ? 'filled' : ''}`}
                    onClick={() => updateSoda(i < sodaCans ? i : i + 1)}
                  >
                    <SODA_ICON filled={i < sodaCans} />
                  </button>
                ))}
              </div>
              <div className="bev-count">{sodaCans} can{sodaCans !== 1 ? 's' : ''}</div>
              <div className="bev-controls">
                <button className="bev-btn minus" onClick={() => updateSoda(sodaCans - 1)} disabled={sodaCans === 0}>−</button>
                <button className="bev-btn plus soda-plus" onClick={() => updateSoda(sodaCans + 1)}>+</button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: History log */}
        <div className="bev-history">
          <div className="bev-history-title">Past 7 days</div>
          {history.length === 0 ? (
            <div className="bev-history-empty">No previous logs yet.</div>
          ) : (
            <div className="bev-history-list">
              {history.map(row => (
                <div key={row.date} className="bev-history-row">
                  <div className="bev-history-date">
                    {format(new Date(row.date + 'T00:00:00'), 'EEE, MMM d')}
                  </div>
                  <div className="bev-history-items">
                    <div className="bev-history-item water-item">
                      <span className="bev-history-icon">💧</span>
                      <span>{row.glasses ?? 0}<span className="bev-history-unit"> glasses</span></span>
                    </div>
                    <div className="bev-history-item tea-item">
                      <span className="bev-history-icon">🍵</span>
                      <span>{row.tea_cups ?? 0}<span className="bev-history-unit"> cups</span></span>
                    </div>
                    <div className="bev-history-item soda-item">
                      <span className="bev-history-icon">🥤</span>
                      <span>{row.soda_cans ?? 0}<span className="bev-history-unit"> cans</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}