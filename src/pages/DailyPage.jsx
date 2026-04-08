import React, { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react'
import './DailyPage.css'

const CATEGORY_COLORS = {
  family: { bg: 'var(--terracotta-light)', text: 'var(--terracotta-dark)', label: 'Family' },
  work: { bg: 'var(--dusty-blue-light)', text: 'var(--dusty-blue)', label: 'Work' },
  self: { bg: 'var(--sage-light)', text: 'var(--sage)', label: 'Self-care' },
  home: { bg: 'var(--amber-light)', text: 'var(--amber)', label: 'Home' },
  finance: { bg: 'var(--lavender-light)', text: 'var(--lavender)', label: 'Finance' },
}

const QUICK_PROMPTS = [
  'Help me plan meals for the week',
  'Give me a 5-minute self-care idea',
  'Help me write a quick work email',
  'What should I tackle first today?',
]

export default function DailyPage({ tasks, toggleTask, setPage }) {
  const now = new Date()
  const todayTasks = tasks.filter(t => t.show_today && !t.done).slice(0, 5)
  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="daily-page">
      <header className="daily-header">
        <div>
          <div className="daily-date">{format(now, 'EEEE, MMMM d')}</div>
          <h1 className="daily-title">Your day at a glance</h1>
        </div>
        <div className="daily-progress-wrap">
          <div className="daily-progress-label">{done} of {total} done</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      <div className="daily-grid">
        <section className="daily-section tasks-section">
          <div className="section-header">
            <h2 className="section-title">Today's tasks</h2>
            <button className="section-link" onClick={() => setPage('tasks')}>
              See all <ArrowRight size={14} />
            </button>
          </div>
          <div className="task-list">
            {todayTasks.map(task => {
              const cat = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.home
              return (
                <div key={task.id} className={`task-row ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
                  <div className="task-check">
                    {task.done
                      ? <CheckCircle2 size={18} color="var(--sage)" />
                      : <Circle size={18} color="var(--ink-faint)" />
                    }
                  </div>
                  <span className="task-text">{task.text}</span>
                  <span className="task-cat-pill" style={{ background: cat.bg, color: cat.text }}>
                    {cat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="daily-section ask-section">
          <div className="section-header">
            <h2 className="section-title">Ask your assistant</h2>
          </div>
          <div className="quick-prompt-intro">
            <Sparkles size={16} color="var(--terracotta)" />
            <span>Quick starters</span>
          </div>
          <div className="quick-prompts">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                className="quick-prompt-btn"
                onClick={() => setPage('chat')}
              >
                {prompt}
                <ArrowRight size={13} />
              </button>
            ))}
          </div>
        </section>

        <section className="daily-section mood-section">
          <h2 className="section-title">How are you feeling?</h2>
          <div className="mood-grid">
            {['Overwhelmed', 'Tired', 'OK', 'Good', 'Great'].map(mood => (
              <button key={mood} className="mood-btn" onClick={() => setPage('chat')}>
                {mood}
              </button>
            ))}
          </div>
          <p className="mood-hint">Tap to chat about your day</p>
        </section>
      </div>
    </div>
  )
}
