import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Widget = Database['public']['Tables']['widgets']['Row'];
type NewWidget = Database['public']['Tables']['widgets']['Insert'];

export const getWidgets = async (userId: string) => {
  const { data, error } = await supabase
    .from('widgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Widget[];
};

export const createWidget = async (widget: NewWidget) => {
  const { data, error } = await supabase
    .from('widgets')
    .insert([widget])
    .select()
    .single();

  if (error) throw error;
  return data as Widget;
};

export const updateWidget = async (widgetId: string, updates: Partial<Widget>) => {
  const { data, error } = await supabase
    .from('widgets')
    .update(updates)
    .eq('id', widgetId)
    .select()
    .single();

  if (error) throw error;
  return data as Widget;
};

export const deleteWidget = async (widgetId: string) => {
  const { error } = await supabase
    .from('widgets')
    .delete()
    .eq('id', widgetId);

  if (error) throw error;
};