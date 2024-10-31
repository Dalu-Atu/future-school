import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://ftjzyzfaxuwfwkqpcytv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0anp5emZheHV3ZndrcXBjeXR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDExNDY0MiwiZXhwIjoyMDI5NjkwNjQyfQ.Na_YowsLP2qa3o3h5QBp-Xx6--MPUP37-1REFHArIRY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
