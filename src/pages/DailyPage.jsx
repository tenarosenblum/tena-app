import React, { useState } from 'react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react'
import './DailyPage.css'


const QUOTES = [
  { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: "Sylvia Plath" },
  { text: "I desire the things that will destroy me in the end.", author: "Sylvia Plath" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Sylvia Plath" },
  { text: "The scariest moment is always just before you start.", author: "Sylvia Plath" },
  { text: "All that we see or seem is but a dream within a dream.", author: "Edgar Allan Poe" },
  { text: "I became insane, with long intervals of horrible sanity.", author: "Edgar Allan Poe" },
  { text: "Never to suffer would never to have been blessed.", author: "Edgar Allan Poe" },
  { text: "Words have no power to impress the mind without the exquisite horror of their reality.", author: "Edgar Allan Poe" },
  { text: "She was a girl who knew how to be happy even when she was sad. And that's important.", author: "Marilyn Monroe" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
  { text: "I dwell in possibility.", author: "Emily Dickinson" },
  { text: "Forever is composed of nows.", author: "Emily Dickinson" },
  { text: "That it will never come again is what makes life so sweet.", author: "Emily Dickinson" },
  { text: "If you are not too long, I will wait here for you all my life.", author: "Oscar Wilde" },
  { text: "And I have known the eyes already, known them all.", author: "T.S. Eliot" },
  { text: "I am homesick for a place I am not sure even exists.", author: "Iain Thomas" },
  { text: "And every day, the world will drag you by the hand, yelling 'This is important! And this is important!' And each day, it's up to you to yank your hand back.", author: "Iain Thomas" },
  { text: "Be the person you needed when you were younger.", author: "Iain Thomas" },
  { text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", author: "Fyodor Dostoevsky" },
  { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: "Fyodor Dostoevsky" },
  { text: "To love someone means to see them as God intended them.", author: "Fyodor Dostoevsky" },
  { text: "Beauty will save the world.", author: "Fyodor Dostoevsky" },
  { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
  { text: "You do not have to be good. You do not have to walk on your knees for a hundred miles through the desert repenting.", author: "Mary Oliver" },
  { text: "Instructions for living a life: Pay attention. Be astonished. Tell about it.", author: "Mary Oliver" },
  { text: "Keep some room in your heart for the unimaginable.", author: "Mary Oliver" },
  { text: "We are here to abet creation and to witness it, to notice each thing so each thing gets noticed.", author: "Mary Oliver" },
  { text: "We are all going to die, all of us, what a circus! That alone should make us love each other.", author: "Charles Bukowski" },
  { text: "Find what you love and let it kill you.", author: "Charles Bukowski" },
  { text: "Sometimes you climb out of bed in the morning and you think, I'm not going to make it, but you laugh inside — remembering all the times you've felt that way.", author: "Charles Bukowski" },
  { text: "Two roads diverged in a wood, and I — I took the one less traveled by.", author: "Robert Frost" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "No tears in the writer, no tears in the reader.", author: "Robert Frost" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.", author: "Charlotte Brontë" },
  { text: "I would always rather be happy than dignified.", author: "Charlotte Brontë" },
  { text: "He's more myself than I am. Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë" },
  { text: "If all else perished, and he remained, I should still continue to be.", author: "Emily Brontë" },
  { text: "I have dreamt in my life, dreams that have stayed with me ever after.", author: "Emily Brontë" },
  { text: "But he that dares not grasp the thorn should never crave the rose.", author: "Anne Brontë" },
  { text: "All our talents increase in the using, and every faculty, both good and bad, strengthens by exercise.", author: "Anne Brontë" },
  { text: "I'm nobody! Who are you? Are you nobody, too?", author: "Emily Dickinson" },
{ text: "After great pain, a formal feeling comes.", author: "Emily Dickinson" },
{ text: "The soul should always stand ajar, ready to welcome the ecstatic experience.", author: "Emily Dickinson" },
{ text: "To live is so startling it leaves little time for anything else.", author: "Emily Dickinson" },
{ text: "Not knowing when the dawn will come I open every door.", author: "Emily Dickinson" },
{ text: "Saying nothing sometimes says the most.", author: "Emily Dickinson" },
{ text: "If I can stop one heart from breaking, I shall not live in vain.", author: "Emily Dickinson" },
{ text: "The heart wants what it wants, or else it does not care.", author: "Emily Dickinson" },
{ text: "Parting is all we know of heaven, and all we need of hell.", author: "Emily Dickinson" },
{ text: "One need not be a chamber to be haunted.", author: "Emily Dickinson" },
{ text: "Truth is so rare that it is delightful to tell it.", author: "Emily Dickinson" },
{ text: "A word is dead when it is said, some say. I say it just begins to live that day.", author: "Emily Dickinson" },
{ text: "Behavior is what a man does, not what he thinks, feels, or believes.", author: "Emily Dickinson" },
{ text: "Because I could not stop for Death, he kindly stopped for me.", author: "Emily Dickinson" },
{ text: "They say that God is everywhere, and yet we always think of Him as somewhat of a recluse.", author: "Emily Dickinson" },
]

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
  'What should I tackle first today?',
]

export default function DailyPage({ tasks, toggleTask, setPage, setSelectedMood }) {
  const now = new Date()
  const todayTasks = tasks.filter(t => t.show_today && !t.done).slice(0, 5)
  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length]

  const [weather, setWeather] = useState(null)

useEffect(() => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&temperature_unit=fahrenheit`
    )
    const data = await res.json()
    setWeather(data.current_weather)
  })
}, [])

const getWeatherLabel = (code) => {
  if (code === 0) return 'Clear sky'
  if (code <= 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rainy'
  if (code <= 79) return 'Snowy'
  if (code <= 99) return 'Stormy'
  return 'Unknown'
}

const getWeatherIcon = (code) => {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

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

<section className="daily-section weather-section">
  <div className="weather-sun" />
  <h2 className="section-title">Weather</h2>
  {!weather ? (
    <div className="weather-loading">Fetching your location...</div>
  ) : (
    <div className="weather-content">
      <div className="weather-icon">{getWeatherIcon(weather.weathercode)}</div>
      <div className="weather-temp">{Math.round(weather.temperature)}°F</div>
      <div className="weather-label">{getWeatherLabel(weather.weathercode)}</div>
      <div className="weather-wind">Wind {Math.round(weather.windspeed)} mph</div>
    </div>
  )}
</section>
      </div>
    </div>
  )
}
