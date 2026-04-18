import { Trash2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, subDays, parseISO } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import './SleepTracker.css'


const QUALITY = [
  { id: 'great', label: 'Great', color: 'var(--sage)' },
  { id: 'good', label: 'Good', color: 'var(--dusty-blue)' },
  { id: 'okay', label: 'Okay', color: 'var(--amber)' },
  { id: 'poor', label: 'Poor', color: 'var(--terracotta)' },
]

function calculateHours(bedtime, wakeTime) {
  const [bH, bM] = bedtime.split(':').map(Number)
  const [wH, wM] = wakeTime.split(':').map(Number)
  let minutes = (wH * 60 + wM) - (bH * 60 + bM)
  if (minutes < 0) minutes += 24 * 60
  return Math.round((minutes / 60) * 100) / 100
}

export default function SleepTracker() {
  const [logs, setLogs] = useState([])
  const [view, setView] = useState('weekly')
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [bedtime, setBedtime] = useState('22:00')
  const [wakeTime, setWakeTime] = useState('06:00')
  const [quality, setQuality] = useState('good')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .order('date', { ascending: false })
    if (!error) setLogs(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!bedtime || !wakeTime) return
    setSaving(true)
    const hours_slept = calculateHours(bedtime, wakeTime)
    const { data, error } = await supabase
      .from('sleep_logs')
      .upsert([{ date, bedtime, wake_time: wakeTime, hours_slept, quality, notes }], { onConflict: 'date' })
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
  const deleteLog = async (id) => {
  const { error } = await supabase.from('sleep_logs').delete().eq('id', id)
  if (!error) setLogs(prev => prev.filter(l => l.id !== id))
}

  const hours = calculateHours(bedtime, wakeTime)

  const days = view === 'weekly' ? 7 : 30
  const chartData = Array.from({ length: days }, (_, i) => {
    const d = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd')
    const log = logs.find(l => l.date === d)
    return {
      date: format(subDays(new Date(), days - 1 - i), view === 'weekly' ? 'EEE' : 'MMM d'),
      hours: log ? log.hours_slept : null,
      quality: log ? log.quality : null,
    }
  })

  const avgHours = logs.slice(0, days).reduce((sum, l) => sum + Number(l.hours_slept), 0) / (logs.slice(0, days).length || 1)

  return (
    <div className="sleep-tracker">
      <div className="sleep-grid">
        <div className="sleep-log-card">
          <div className="sleep-card-title">Log last night's sleep</div>

          <div className="sleep-field">
            <label className="sleep-label">Date</label>
            <input type="date" className="sleep-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="sleep-row">
            <div className="sleep-field">
              <label className="sleep-label">Bedtime</label>
              <input type="time" className="sleep-input" value={bedtime} onChange={e => setBedtime(e.target.value)} />
            </div>
            <div className="sleep-field">
              <label className="sleep-label">Wake time</label>
              <input type="time" className="sleep-input" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
            </div>
          </div>

          <div className="sleep-hours-display">
            <span className="sleep-hours-number">{hours}</span>
            <span className="sleep-hours-label">hours slept</span>
          </div>

          <div className="sleep-field">
            <label className="sleep-label">Quality</label>
            <div className="quality-selector">
              {QUALITY.map(q => (
                <button
                  key={q.id}
                  className={`quality-btn ${quality === q.id ? 'active' : ''}`}
                  style={quality === q.id ? { background: q.color, borderColor: q.color, color: 'white' } : {}}
                  onClick={() => setQuality(q.id)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sleep-field">
            <label className="sleep-label">Notes (optional)</label>
            <input
              type="text"
              className="sleep-input"
              placeholder="e.g. woke up at 3am, had vivid dreams..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="sleep-save-btn" onClick={handleSave} disabled={saving}>
            {success ? 'Saved!' : saving ? 'Saving...' : 'Log sleep'}
          </button>
        </div>

        <div className="sleep-chart-card">
          <div className="sleep-chart-header">
            <div className="sleep-card-title">Sleep history</div>
            <div className="view-toggle">
              <button className={`view-btn ${view === 'weekly' ? 'active' : ''}`} onClick={() => setView('weekly')}>Week</button>
              <button className={`view-btn ${view === 'monthly' ? 'active' : ''}`} onClick={() => setView('monthly')}>Month</button>
            </div>
          </div>

          <div className="sleep-stats">
            <div className="sleep-stat">
              <span className="stat-number">{logs.length > 0 ? Number(logs[0].hours_slept).toFixed(1) : '—'}</span>
              <span className="stat-label">Last night</span>
            </div>
            <div className="sleep-stat">
              <span className="stat-number">{logs.length > 0 ? avgHours.toFixed(1) : '—'}</span>
              <span className="stat-label">Avg hours</span>
            </div>
            <div className="sleep-stat">
              <span className="stat-number">{logs.length > 0 ? Math.max(...logs.slice(0, days).map(l => l.hours_slept)).toFixed(1) : '—'}</span>
              <span className="stat-label">Best night</span>
            </div>
          </div>

          {loading ? (
            <div className="chart-loading">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => value ? [`${value} hrs`, 'Sleep'] : ['No data', 'Sleep']}
                  contentStyle={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
                />
                <ReferenceLine y={8} stroke="var(--sage)" strokeDasharray="4 4" label={{ value: '8h goal', fontSize: 11, fill: 'var(--sage)' }} />
                <Line type="monotone" dataKey="hours" stroke="var(--dusty-blue)" strokeWidth={2} dot={{ fill: 'var(--dusty-blue)', r: 4 }} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          )}

          <div className="sleep-log-list">
            <div className="sleep-log-list-title">Recent logs</div>
            {logs.slice(0, 7).map(log => {
              const q = QUALITY.find(q => q.id === log.quality)
              return (
                <div key={log.id} className="sleep-log-row">
                  <div className="log-main">
                    <span className="log-date">{format(parseISO(log.date), 'EEE, MMM d')}</span>
                    <span className="log-hours">{Number(log.hours_slept).toFixed(1)}h</span>
                    <span className="log-quality" style={{ color: q?.color }}>{q?.label}</span>
                    <span className="log-times">{log.bedtime} → {log.wake_time}</span>
                    <button className="log-delete" onClick={() => deleteLog(log.id)}><Trash2 size={13} /></button>
                  </div>
                  {log.notes && <div className="log-notes">{log.notes}</div>}
                </div>
              )
            })}
            {logs.length === 0 && <div className="no-logs">No sleep logged yet — start tracking tonight!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}