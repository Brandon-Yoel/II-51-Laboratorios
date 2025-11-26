import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==========================
// CONFIGURA TU SUPABASE
// ==========================
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbXh2eW5xcmVncHpwZ3Z5YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDkxMjYsImV4cCI6MjA3OTM4NTEyNn0.SLuYczImg9ZKeiafAI6rgr0-QsqEyG8EC7x-xEQW5vE";
let SUPABASE_URL = "https://limxvynqregpzpgvyahg.supabase.co";

// Crear cliente una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);