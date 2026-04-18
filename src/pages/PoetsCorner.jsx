import React, { useState } from 'react'
import { BookOpen } from 'lucide-react'
import './PoetsCorner.css'

const QUOTES = [
  { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: "Sylvia Plath" },
  { text: "I desire the things that will destroy me in the end.", author: "Sylvia Plath" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Sylvia Plath" },
  { text: "The scariest moment is always just before you start.", author: "Sylvia Plath" },
  { text: "All that we see or seem is but a dream within a dream.", author: "Edgar Allan Poe" },
  { text: "I became insane, with long intervals of horrible sanity.", author: "Edgar Allan Poe" },
  { text: "Never to suffer would never to have been blessed.", author: "Edgar Allan Poe" },
  { text: "Words have no power to impress the mind without the exquisite horror of their reality.", author: "Edgar Allan Poe" },
  { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
  { text: "I dwell in possibility.", author: "Emily Dickinson" },
  { text: "Forever is composed of nows.", author: "Emily Dickinson" },
  { text: "That it will never come again is what makes life so sweet.", author: "Emily Dickinson" },
  { text: "I'm nobody! Who are you? Are you nobody, too?", author: "Emily Dickinson" },
  { text: "After great pain, a formal feeling comes.", author: "Emily Dickinson" },
  { text: "The soul should always stand ajar, ready to welcome the ecstatic experience.", author: "Emily Dickinson" },
  { text: "To live is so startling it leaves little time for anything else.", author: "Emily Dickinson" },
  { text: "Not knowing when the dawn will come I open every door.", author: "Emily Dickinson" },
  { text: "The heart wants what it wants, or else it does not care.", author: "Emily Dickinson" },
  { text: "Because I could not stop for Death, he kindly stopped for me.", author: "Emily Dickinson" },
  { text: "If you are not too long, I will wait here for you all my life.", author: "Oscar Wilde" },
  { text: "I am homesick for a place I am not sure even exists.", author: "Iain Thomas" },
  { text: "Be the person you needed when you were younger.", author: "Iain Thomas" },
  { text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", author: "Fyodor Dostoevsky" },
  { text: "Beauty will save the world.", author: "Fyodor Dostoevsky" },
  { text: "To love someone means to see them as God intended them.", author: "Fyodor Dostoevsky" },
  { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
  { text: "Instructions for living a life: Pay attention. Be astonished. Tell about it.", author: "Mary Oliver" },
  { text: "Keep some room in your heart for the unimaginable.", author: "Mary Oliver" },
  { text: "We are all going to die, all of us, what a circus! That alone should make us love each other.", author: "Charles Bukowski" },
  { text: "Find what you love and let it kill you.", author: "Charles Bukowski" },
  { text: "Two roads diverged in a wood, and I — I took the one less traveled by.", author: "Robert Frost" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.", author: "Charlotte Brontë" },
  { text: "He's more myself than I am. Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë" },
  { text: "I have dreamt in my life, dreams that have stayed with me ever after.", author: "Emily Brontë" },
  { text: "But he that dares not grasp the thorn should never crave the rose.", author: "Anne Brontë" },
]

const AUTHORS = [...new Set(QUOTES.map(q => q.author))]

export default function PoetsCorner() {
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const dailyQuote = QUOTES[dayOfYear % QUOTES.length]

  const filtered = selectedAuthor
    ? QUOTES.filter(q => q.author === selectedAuthor)
    : QUOTES

  return (
    <div className="poets-page">
      <header className="poets-header">
        <div className="poets-header-icon"><BookOpen size={20} /></div>
        <div>
          <h1 className="poets-title">Poet's Corner</h1>
          <p className="poets-sub">A quiet place for words that stay with you</p>
        </div>
      </header>

      <div className="poets-daily">
        <div className="poets-daily-label">Quote of the day</div>
        <blockquote className="poets-daily-quote">"{dailyQuote.text}"</blockquote>
        <div className="poets-daily-author">— {dailyQuote.author}</div>
      </div>

      <div className="poets-filter">
        <button
          className={`author-pill ${!selectedAuthor ? 'active' : ''}`}
          onClick={() => setSelectedAuthor(null)}
        >
          All
        </button>
        {AUTHORS.map(author => (
          <button
            key={author}
            className={`author-pill ${selectedAuthor === author ? 'active' : ''}`}
            onClick={() => setSelectedAuthor(selectedAuthor === author ? null : author)}
          >
            {author}
          </button>
        ))}
      </div>

      <div className="poets-grid">
        {filtered.map((quote, i) => (
          <div key={i} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <span className="quote-author">— {quote.author}</span>
          </div>
        ))}
      </div>
    </div>
  )
}