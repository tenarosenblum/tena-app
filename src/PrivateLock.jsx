import React, { createContext, useContext, useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

const LockContext = createContext(null)

// ── Change this to your password ──────────────────────────────────────────────
const PRIVATE_PASSWORD = 'mama2024'
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'mama_unlocked'

export function PrivateLockProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  })

  const unlock = (pw) => {
    if (pw === PRIVATE_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
      return true
    }
    return false
  }

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  return (
    <LockContext.Provider value={{ unlocked, unlock, lock }}>
      {children}
    </LockContext.Provider>
  )
}

export function useLock() {
  return useContext(LockContext)
}

export function PasswordGate() {
  const { unlock } = useLock()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = unlock(pw)
    if (!ok) {
      setError(true)
      setShake(true)
      setPw('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.card, animation: shake ? 'shake 0.4s ease' : 'none' }}>
        <div style={styles.iconWrap}>
          <Lock size={22} color="white" />
        </div>
        <h2 style={styles.title}>Private section</h2>
        <p style={styles.sub}>Enter your password to access this page</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              placeholder="Password"
              autoFocus
              style={{ ...styles.input, borderColor: error ? '#e05a6b' : 'rgba(28,24,18,0.15)' }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              style={styles.eyeBtn}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p style={styles.error}>Incorrect password — try again</p>}
          <button type="submit" style={styles.btn}>Unlock</button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  overlay: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--cream)',
    padding: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px 36px',
    maxWidth: '380px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(28,24,18,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid rgba(28,24,18,0.06)',
  },
  iconWrap: {
    width: '52px',
    height: '52px',
    background: 'var(--terracotta)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--ink)',
    marginBottom: '8px',
  },
  sub: {
    fontSize: '14px',
    color: 'var(--ink-muted)',
    marginBottom: '28px',
    lineHeight: '1.5',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '12px 44px 12px 16px',
    borderRadius: '10px',
    border: '1.5px solid rgba(28,24,18,0.15)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    color: 'var(--ink)',
    background: 'var(--cream)',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--ink-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    fontSize: '13px',
    color: '#e05a6b',
    textAlign: 'left',
    marginTop: '-4px',
  },
  btn: {
    padding: '12px',
    background: 'var(--terracotta)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    marginTop: '4px',
    transition: 'opacity 0.15s',
  },
}
