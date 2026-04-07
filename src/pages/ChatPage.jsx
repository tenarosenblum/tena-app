import React, { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import { sendMessage } from '../anthropic.js'
import './ChatPage.css'

const MODES = [
  { id: 'general', label: 'General', color: 'var(--terracotta)' },
  { id: 'work', label: 'Work', color: 'var(--dusty-blue)' },
  { id: 'family', label: 'Family', color: 'var(--terracotta)' },
  { id: 'wellness', label: 'Wellness', color: 'var(--sage)' },
  { id: 'finance', label: 'Finance', color: 'var(--lavender)' },
]

const STARTERS = {
  general: ['What should I focus on today?', 'I feel overwhelmed, help me prioritize', 'Quick win I can do in 10 minutes?'],
  work: ['Help me write a professional email', 'I have a tough meeting tomorrow', 'How do I say no to extra work?'],
  family: ['Fun dinner table conversation starters', 'My kid won\'t do homework — tips?', 'Easy weeknight meal ideas'],
  wellness: ['I\'m exhausted, quick energy boost?', '5-minute stress relief idea', 'Help me build a sleep routine'],
  finance: ['How do I start an emergency fund?', 'Tips to cut monthly spending', 'Explain a Roth IRA simply'],
}

function Message({ msg }) {
  return (
    <div className={`msg-wrap ${msg.role}`}>
      {msg.role === 'assistant' && (
        <div className="msg-avatar">M</div>
      )}
      <div className={`msg-bubble ${msg.role}`}>
        {msg.content}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [mode, setMode] = useState('general')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Tena, here to help with everything on your plate. What's going on today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiMessages = newMessages.filter(m => m.role !== 'system')
      const reply = await sendMessage(apiMessages, mode)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops — couldn't reach the API. Make sure your API key is set in `src/anthropic.js`."
      }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Fresh start! What's on your mind?" }])
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    const m = MODES.find(m => m.id === newMode)
    setMessages([{
      role: 'assistant',
      content: `Switched to ${m.label} mode. How can I help?`
    }])
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="mode-tabs">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? 'active' : ''}`}
              style={mode === m.id ? { '--mode-color': m.color } : {}}
              onClick={() => switchMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button className="clear-btn" onClick={clearChat} title="Clear chat">
          <RotateCcw size={14} />
          Clear
        </button>
      </div>

      <div className="messages-area">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div className="msg-wrap assistant">
            <div className="msg-avatar">M</div>
            <div className="msg-bubble assistant loading">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="starters-row">
          {STARTERS[mode].map(s => (
            <button key={s} className="starter-btn" onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-textarea"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type a message… (Enter to send)"
          rows={1}
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
