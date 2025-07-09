import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase'; // If app_settings table is added to DB schema types

/**
 * Represents a single application setting.
 * The `value` can be of any type that can be stored in JSONB (string, number, boolean, object, array).
 */
export interface AppSetting {
  key: string; /** Unique key for the setting (e.g., 'store_name', 'default_shipping_cost'). */
  value: any;  /** The value of the setting. */
  description?: string; /** Optional description of what the setting controls. */
  // Supabase schema might also include created_at, updated_at
}

// Define a type for the database row if it were in Supabase schema
// type AppSettingDB = Database['public']['Tables']['app_settings']['Row'];
// type AppSettingInsert = Database['public']['Tables']['app_settings']['Insert'];

/**
 * Service class for managing application-wide settings.
 * Assumes a Supabase table named 'app_settings' with columns:
 * - key: TEXT (PRIMARY KEY, UNIQUE)
 * - value: JSONB
 * - description: TEXT (NULLABLE)
 * - updated_at: TIMESTAMPTZ (DEFAULT now())
 *
 * Note: This service is currently mocked as the 'app_settings' table and its
 * Supabase schema types are not yet implemented.
 */
export class SettingsService {
  /**
   * Fetches all application settings or a predefined set.
   * @returns A promise that resolves to an array of AppSetting objects.
   * @throws Will throw an error if fetching from the database fails (in real implementation).
   */
  static async getSettings(): Promise<AppSetting[]> {
    // TODO: Replace mock with actual Supabase call when 'app_settings' table is available.
    // Example:
    // const { data, error } = await supabase.from('app_settings').select('*');
    // if (error) {
    //   console.error('SettingsService.getSettings - Error:', error);
    //   throw error;
    // }
    // return data || [];
    console.warn("SettingsService.getSettings: Using mocked data. Implement database interaction.");
    return Promise.resolve([
      { key: 'store_name', value: 'LAKKI PHONES', description: 'The public name of the store.' },
      { key: 'default_shipping_cost', value: 2.500, description: 'Default shipping cost in KWD.' },
      { key: 'free_shipping_threshold', value: 15.000, description: 'Order amount above which shipping is free (KWD).' },
      { key: 'admin_notification_email', value: 'admin@lakkiphones.com', description: 'Email for admin notifications.' },
      { key: 'maintenance_mode', value: false, description: 'Enable/disable site maintenance mode.' },
      // KNET Merchant ID is an example of a setting that might be better as an env var,
      // but could be here if it needs to be changed via admin UI without redeploy.
      { key: 'knet_merchant_id', value: import.meta.env.VITE_KNET_MERCHANT_ID || 'TEST_MERCHANT_ID_FROM_SETTINGS', description: 'KNET Merchant ID (can be overridden by env var)' },
    ]);
  }

  /**
   * Fetches a single application setting by its key.
   * @param key - The unique key of the setting to retrieve.
   * @returns A promise that resolves to an AppSetting object or null if not found.
   * @throws Will throw an error if fetching fails (in real implementation).
   */
  static async getSetting(key: string): Promise<AppSetting | null> {
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const { data, error } = await supabase.from('app_settings').select('*').eq('key', key).maybeSingle();
    // if (error) {
    //   console.error(`SettingsService.getSetting - Error for key ${key}:`, error);
    //   if (error.code === 'PGRST116') return null; // Not found is not an error for maybeSingle
    //   throw error;
    // }
    // return data;
    console.warn(`SettingsService.getSetting for key '${key}': Using mocked data.`);
    const settings = await this.getSettings(); // Uses the mocked getSettings
    return settings.find(s => s.key === key) || null;
  }

  /**
   * Updates an existing application setting or creates it if it doesn't exist (upsert).
   * @param key - The unique key of the setting.
   * @param value - The new value for the setting.
   * @returns A promise that resolves to the updated/created AppSetting object.
   * @throws Will throw an error if the update/insert operation fails.
   */
  static async updateSetting(key: string, value: any): Promise<AppSetting | null> {
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const { data, error } = await supabase
    //   .from('app_settings')
    //   .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    //   .select()
    //   .single();
    // if (error || !data) {
    //   console.error(`SettingsService.updateSetting - Error for key ${key}:`, error);
    //   throw error || new Error('Setting update failed to return data.');
    // }
    // return data;
    console.warn(`SettingsService.updateSetting for key '${key}': Using mocked data. No actual update performed.`);
    // Simulate update in mock data for demonstration if needed by other parts during this session
    const currentSettings = await this.getSettings(); // This will get the static mock list
    const existingSettingIndex = currentSettings.findIndex(s => s.key === key);
    if (existingSettingIndex > -1) {
        currentSettings[existingSettingIndex].value = value;
        return Promise.resolve(currentSettings[existingSettingIndex]);
    }
    // If key doesn't exist in mock, simulate adding it (though this won't persist across service calls to the static list)
    return Promise.resolve({ key, value, description: `(New mock) Description for ${key}` });
  }

  /**
   * Updates multiple application settings.
   * This is a conceptual method; actual implementation might involve a loop of `updateSetting`
   * or a batch upsert if the backend/Supabase supports it efficiently for this table structure.
   * @param settingsToUpdate - An array of {key, value} objects for the settings to update.
   * @returns A promise that resolves to an array of the updated AppSetting objects.
   * @throws Will throw an error if any update fails.
   */
  static async updateMultipleSettings(settingsToUpdate: Array<{ key: string; value: any }>): Promise<AppSetting[]> {
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const upserts = settingsToUpdate.map(s => ({
    //   key: s.key,
    //   value: s.value,
    //   updated_at: new Date().toISOString()
    // }));
    // const { data, error } = await supabase
    //   .from('app_settings')
    //   .upsert(upserts, { onConflict: 'key' })
    //   .select();
    // if (error) {
    //   console.error('SettingsService.updateMultipleSettings - Error:', error);
    //   throw error;
    // }
    // return data || [];
    console.warn("SettingsService.updateMultipleSettings: Using mocked data. No actual updates performed.");
    const currentSettings = await this.getSettings(); // Gets static mock list
    const updatedSettingsResult: AppSetting[] = [];

    for (const settingToUpdate of settingsToUpdate) {
        const existingSetting = currentSettings.find(cs => cs.key === settingToUpdate.key);
        if (existingSetting) {
            updatedSettingsResult.push({ ...existingSetting, value: settingToUpdate.value });
        } else {
            updatedSettingsResult.push({ key: settingToUpdate.key, value: settingToUpdate.value, description: `(New mock) ${settingToUpdate.key}` });
        }
    }
    // This mock doesn't actually update the static list in getSettings, just simulates return.
    return Promise.resolve(updatedSettingsResult);
  }
}
