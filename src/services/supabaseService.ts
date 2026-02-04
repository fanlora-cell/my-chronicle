
import { createClient } from '@supabase/supabase-js';
import { Activity } from '../types';

// Replace these with your actual Supabase credentials found in Project Settings > API
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  async fetchActivities(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    return data || [];
  },

  async upsertActivity(activity: Activity): Promise<boolean> {
    const { error } = await supabase
      .from('activities')
      .upsert(activity);

    if (error) {
      console.error('Error upserting activity:', error);
      return false;
    }
    return true;
  },

  async deleteActivity(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('activities')
      .delete()
      .match({ id });

    if (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
    return true;
  }
};
