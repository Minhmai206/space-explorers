// =============================================
// SUPABASE CONFIG - Space Explorers
// =============================================

const SUPABASE_URL = 'https://fxfxjbvhaolwchrxmvcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZnhqYnZoYW9sd2NocnhtdmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NTU0OTYsImV4cCI6MjA5MTUzMTQ5Nn0.lYjOlxeCet6Aspty_qU0LKkvXVz2Yf0G6E47gcMVt90';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;