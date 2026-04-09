import React, { useState } from 'react'
import SleepTracker from '../components/SleepTracker.jsx'
import WorkoutTracker from '../components/WorkoutTracker.jsx'
import WaterTracker from '../components/WaterTracker.jsx'
import FoodTracker from '../components/FoodTracker.jsx'
import './HealthPage.css'

const HEALTH_TABS = [
  { id: 'sleep', label: 'Sleep' },
  { id: 'workout', label: 'Workout' },
  { id: 'water', label: 'Water' },
  { id: 'food', label: 'Food' },
]

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('sleep')

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
    </div>
  )
}