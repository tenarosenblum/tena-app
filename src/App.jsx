import FilesPage from './pages/FilesPage.jsx'
import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatPage from './pages/ChatPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import DailyPage from './pages/DailyPage.jsx'
import { supabase } from './supabase.js'
import './App.css'
import RemindersPage from './pages/RemindersPage.jsx'
import HealthPage from './pages/HealthPage.jsx'
import PoetsCorner from './pages/PoetsCorner.jsx'

export default function App() {
  const [page, setPage] = useState('daily')
  const [selectedMood, setSelectedMood] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setTasks(data)
    setLoading(false)
  }

  const addTask = async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, done: false }])
      .select()
    if (!error) setTasks(prev => [data[0], ...prev])
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    const { error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', id)
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  const updateTask = async (id, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const taskProps = { tasks, addTask, toggleTask, deleteTask, updateTask }

  if (loading) return <div style={{ padding: '40px', fontFamily: 'var(--font-body)', color: 'var(--ink-muted)' }}>Loading...</div>

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} tasks={tasks} />
      <main className="app-main">
        {page === 'daily' && <DailyPage {...taskProps} setPage={setPage} setSelectedMood={setSelectedMood} />}
        {page === 'chat' && <ChatPage />}
        {page === 'tasks' && <TasksPage {...taskProps} />}
        {page === 'reminders' && <RemindersPage />}
        {page === 'files' && <FilesPage />}
        {page === 'health' && <HealthPage initialMood={selectedMood} />}
        {page === 'poets' && <PoetsCorner />}
      </main>
    </div>
  )
}