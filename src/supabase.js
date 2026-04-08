import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esgfbteyvbhlusuzssgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ2ZidGV5dmJobHVzdXpzc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjQ3MDMsImV4cCI6MjA5MTE0MDcwM30.Z6fem95bMS0UQDOISHn95VFFh-r3Y8YgiYfUe10i6ts'

console.log('Supabase loaded')
export const supabase = createClient(supabaseUrl, supabaseAnonKey)