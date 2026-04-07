import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatPage from './pages/ChatPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import DailyPage from './pages/DailyPage.jsx'
import './App.css'

const INITIAL_TASKS = [
  { id: 1, text: 'Schedule pediatrician appointment', category: 'family', priority: 'high', done: false, created: new Date() },
  { id: 2, text: 'Prepare presentation for Tuesday', category: 'work', priority: 'high', done: false, created: new Date() },
  { id: 3, text: 'Restock school snacks', category: 'home', priority: 'medium', done: false, created: new Date() },
  { id: 4, text: '20 min walk or yoga', category: 'self', priority: 'medium', done: false, created: new Date() },
  { id: 5, text: 'Review monthly budget', category: 'finance', priority: 'low', done: false, created: new Date() },
]

export default function App() {
  const [page, setPage] = useState('daily')
  const [tasks, setTasks] = useState(INITIAL_TASKS)

  const addTask = (task) => setTasks(prev => [{ ...task, id: Date.now(), done: false, created: new Date() }, ...prev])
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))
  const updateTask = (id, updates) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

  const taskProps = { tasks, addTask, toggleTask, deleteTask, updateTask }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} tasks={tasks} />
      <main className="app-main">
        {page === 'daily' && <DailyPage {...taskProps} setPage={setPage} />}
        {page === 'chat' && <ChatPage />}
        {page === 'tasks' && <TasksPage {...taskProps} />}
      </main>
    </div>
  )
}
