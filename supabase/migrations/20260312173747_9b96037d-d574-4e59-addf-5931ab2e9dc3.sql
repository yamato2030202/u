
-- Create gangs table
CREATE TABLE public.gangs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  territory TEXT,
  is_recruiting BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gangs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gangs viewable by all" ON public.gangs FOR SELECT USING (true);
CREATE POLICY "Admins manage gangs" ON public.gangs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create rules table
CREATE TABLE public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rules viewable by all" ON public.rules FOR SELECT USING (true);
CREATE POLICY "Admins manage rules" ON public.rules FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create faq table
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQ viewable by all" ON public.faq FOR SELECT USING (true);
CREATE POLICY "Admins manage faq" ON public.faq FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add is_vip to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;

-- Add video_url to jobs if not exists
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add image_url to vip_packages if not exists
ALTER TABLE public.vip_packages ADD COLUMN IF NOT EXISTS image_url TEXT;
