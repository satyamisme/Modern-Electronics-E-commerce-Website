import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { SettingsService, AppSetting } from '../../services/settingsService'; // Assuming path is correct

interface EditableSetting extends AppSetting {
  isDirty?: boolean;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<EditableSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const fetchedSettings = await SettingsService.getSettings();
      setSettings(fetchedSettings.map(s => ({ ...s, isDirty: false })));
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setSettings(prevSettings =>
      prevSettings.map(s =>
        s.key === key ? { ...s, value, isDirty: true } : s
      )
    );
    setSuccessMessage(null); // Clear success message on new change
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const dirtySettings = settings.filter(s => s.isDirty);
    if (dirtySettings.length === 0) {
      setIsLoading(false);
      setSuccessMessage("No changes to save.");
      return;
    }

    try {
      // In a real scenario with many settings, you might update them one by one or have a batch update endpoint
      // For this example, SettingsService.updateMultipleSettings is a mock that simulates this.
      await SettingsService.updateMultipleSettings(
        dirtySettings.map(({ key, value }) => ({ key, value }))
      );
      setSettings(prevSettings => prevSettings.map(s => ({ ...s, isDirty: false })));
      setSuccessMessage("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingInput = (setting: EditableSetting) => {
    const commonProps = {
      id: setting.key,
      value: setting.value as any,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    typeof setting.value === 'number' ? parseFloat(e.target.value) : e.target.value;
        handleInputChange(setting.key, val);
      },
      className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
    };

    switch (typeof setting.value) {
      case 'string':
        return <input type="text" {...commonProps} />;
      case 'number':
        return <input type="number" step="any" {...commonProps} />;
      case 'boolean':
        return (
          <input
            type="checkbox"
            id={setting.key}
            checked={setting.value}
            onChange={(e) => handleInputChange(setting.key, e.target.checked)}
            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
        );
      default:
        // For JSONB or complex objects, a JSON editor or structured fields might be needed
        return <textarea {...commonProps} value={JSON.stringify(setting.value)} disabled rows={3} />;
    }
  };


  if (isLoading && settings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
            Application Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage general settings for the application.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
                onClick={fetchSettings}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
            >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
            </button>
            <button
                onClick={handleSaveSettings}
                disabled={isLoading || !settings.some(s => s.isDirty)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2 disabled:opacity-50"
            >
                <Save className="h-5 w-5" />
                <span>Save Settings</span>
            </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg">
        <div className="divide-y divide-gray-200">
          {settings.map((setting) => (
            <div key={setting.key} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor={setting.key} className="block text-sm font-medium text-gray-800">
                  {setting.description || setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <p className="text-xs text-gray-500 mt-1">Key: <code>{setting.key}</code></p>
              </div>
              <div className="md:col-span-2">
                {renderSettingInput(setting)}
              </div>
            </div>
          ))}
          {settings.length === 0 && !isLoading && (
            <p className="p-6 text-gray-500">No settings available or failed to load.</p>
          )}
        </div>
      </div>
       <div className="mt-6 flex justify-end">
            <button
                onClick={handleSaveSettings}
                disabled={isLoading || !settings.some(s => s.isDirty)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2 disabled:opacity-50"
            >
                <Save className="h-5 w-5" />
                <span>Save Settings</span>
            </button>
       </div>
    </div>
  );
};

export default AdminSettings;
