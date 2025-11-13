import { createClient } from '@supabase/supabase-js';

// It is safe for these to be exposed in a browser-based client.
// Row Level Security (RLS) is used to protect your data.
const supabaseUrl = 'https://hwinxjvnnqruxwtyyfuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aW54anZubnFydXh3dHl5ZnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODI3MDgsImV4cCI6MjA3ODU1ODcwOH0.qmjBdFzimwrxGaVDK5MYNk75eJnUcXt7mzahpj9nf0E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);