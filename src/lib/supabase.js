import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kaatweultfdcjvfzhwpm.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYXR3ZXVsdGZkY2p2Znpod3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDM2MTUsImV4cCI6MjA3NTIxOTYxNX0.PG_7t-Zu2vdWK7dG6N3MBIGVNY986FHTiB9iJNK_H1g'

export const supabase = createClient(supabaseUrl, supabaseKey)
