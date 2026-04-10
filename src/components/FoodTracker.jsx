import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import './FoodTracker.css'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function FoodTracker() {
  const [logs, setLogs] = useState([])
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [mealType, setMealType] = useState('Breakfast')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setLogs(data)
    setLoading(false)
  }

  con