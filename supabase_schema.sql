# supabase_schema.sql
# Выполните этот скрипт в разделе SQL Editor в вашей панели Supabase.

CREATE TABLE law_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'Новый',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Включаем защиту на уровне строк (RLS)
ALTER TABLE law_clients ENABLE ROW LEVEL SECURITY;

-- Для простоты тестирования открываем публичный доступ ко всем операциям.
-- В реальном приложении здесь должны быть политики с авторизацией (auth.uid() и т.д.)
CREATE POLICY "Allow public read" ON law_clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON law_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON law_clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON law_clients FOR DELETE USING (true);
