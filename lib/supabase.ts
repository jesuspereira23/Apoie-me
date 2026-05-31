import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dspameglsaxhfiqfsnns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcGFtZWdsc2F4aGZpcWZzbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDUyNDEsImV4cCI6MjA5NTU4MTI0MX0._slaZPI5XfpX7sDxqKGPlyJKPDiPfUnKj9BZtwphsXE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
