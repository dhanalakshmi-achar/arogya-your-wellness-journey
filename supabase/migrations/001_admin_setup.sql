-- Migration: Admin role setup
-- This sets up the user_roles table, RLS policies, and the has_role function
-- Run this in your Supabase SQL Editor

-- Create app_role enum if not exists
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all roles
CREATE POLICY IF NOT EXISTS "admins_read_all_roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Policy: Admins can insert roles
CREATE POLICY IF NOT EXISTS "admins_insert_roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Policy: Admins can delete roles
CREATE POLICY IF NOT EXISTS "admins_delete_roles" ON public.user_roles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Policy: Users can read their own roles
CREATE POLICY IF NOT EXISTS "users_read_own_roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create or replace the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Grant admin read access to profiles for admin panel
CREATE POLICY IF NOT EXISTS "admins_read_all_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Grant admin delete access to profiles
CREATE POLICY IF NOT EXISTS "admins_delete_profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Grant admin read access to health_metrics for overview
CREATE POLICY IF NOT EXISTS "admins_read_all_health_metrics" ON public.health_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- To make yourself the first super admin, run:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_UUID_HERE', 'admin');