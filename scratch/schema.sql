-- Create inspirations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.inspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.inspirations
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select" ON public.inspirations;
DROP POLICY IF EXISTS "Allow authenticated manage" ON public.inspirations;

-- Policy to allow anonymous/public read access
CREATE POLICY "Allow public select" ON public.inspirations
    FOR SELECT USING (true);

-- Policy to allow authenticated (admin) changes
CREATE POLICY "Allow authenticated manage" ON public.inspirations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure table permissions are granted
GRANT ALL ON public.inspirations TO postgres;
GRANT SELECT ON public.inspirations TO anon;
GRANT ALL ON public.inspirations TO authenticated;
GRANT ALL ON public.inspirations TO service_role;

-- Storage setup: Create 'inspirations' bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspirations', 'inspirations', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies for our bucket if any
DROP POLICY IF EXISTS "Allow public select storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated manage storage" ON storage.objects;

-- Allow public to select files from storage bucket 'inspirations'
CREATE POLICY "Allow public select storage" ON storage.objects
    FOR SELECT USING (bucket_id = 'inspirations');

-- Allow authenticated users to manage files in storage bucket 'inspirations'
CREATE POLICY "Allow authenticated manage storage" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'inspirations') WITH CHECK (bucket_id = 'inspirations');
