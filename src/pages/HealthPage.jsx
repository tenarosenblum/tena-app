import React, { useState } from 'react'
import SleepTracker from '../components/SleepTracker.jsx'
import WorkoutTracker from '../components/WorkoutTracker.jsx'
import WaterTracker from '../components/WaterTracker.jsx'
import FoodTracker from '../components/FoodTracker.jsx'
import MoodTracker from '../components/MoodTracker.jsx'
import './HealthPage.css'

const HEALTH_TABS = [
  { id: 'sleep', label: 'Sleep' },
  { id: 'workout', label: 'Workout' },
  { id: 'water', label: 'Water' },
  { id: 'food', label: 'Food' },
  { id: 'mood', label: 'Mood' },
]

export default function HealthPage({ initialMood = null }) {
  const [activeTab, setActiveTab] = useState(initialMood ? 'mood' : 'sleep')

  return (
    <div className="health-page">
      <header className="health-header">
        <h1 className="health-title">Health</h1>
        <div className="health-tabs">
          {HEALTH_TABS.map(tab => (
            <button
              key={tab.id}
              className={`health-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      {activeTab === 'sleep' && <SleepTracker />}
      {activeTab === 'workout' && <WorkoutTracker />}
      {activeTab === 'water' && <WaterTracker />}
      {activeTab === 'food' && <FoodTracker />}
      {activeTab === 'mood' && <MoodTracker initialMood={initialMood} />}
    </div>
  )
}