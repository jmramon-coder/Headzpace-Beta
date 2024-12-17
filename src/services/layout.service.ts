import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Layout = Database['public']['Tables']['layouts']['Row'];
type NewLayout = Database['public']['Tables']['layouts']['Insert'];

export const getLayouts = async (userId: string) => {
  const { data, error } = await supabase
    .from('layouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Layout[];
};

export const getDefaultLayout = async (userId: string) => {
  const { data, error } = await supabase
    .from('layouts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
  return data as Layout | null;
};

export const createLayout = async (layout: NewLayout) => {
  const { data, error } = await supabase
    .from('layouts')
    .insert([layout])
    .select()
    .single();

  if (error) throw error;
  return data as Layout;
};

export const updateLayout = async (layoutId: string, updates: Partial<Layout>) => {
  const { data, error } = await supabase
    .from('layouts')
    .update(updates)
    .eq('id', layoutId)
    .select()
    .single();

  if (error) throw error;
  return data as Layout;
};

export const deleteLayout = async (layoutId: string) => {
  const { error } = await supabase
    .from('layouts')
    .delete()
    .eq('id', layoutId);

  if (error) throw error;
};