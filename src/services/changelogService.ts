import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase'; // If you have a changelog table in your db schema types
import { ChangelogEntry, ChangeItem } from '../types/changelog'; // Using existing types

// Assuming your Supabase schema might have a 'changelog_entries' table
// type ChangelogEntryDB = Database['public']['Tables']['changelog_entries']['Row'];
// type ChangelogEntryInsert = Database['public']['Tables']['changelog_entries']['Insert'];

// For now, we'll use the existing ChangelogEntry type and simulate DB interaction.
// If 'changelog_entries' table was in supabase.ts, we'd use its generated types:
// type ChangelogEntryDB = Database['public']['Tables']['changelog_entries']['Row'];
// type ChangelogEntryInsert = Database['public']['Tables']['changelog_entries']['Insert'];
// type ChangelogEntryUpdate = Database['public']['Tables']['changelog_entries']['Update'];


// Mock data store (simulates a database table).
// In a real implementation, this would be replaced by Supabase calls.
let mockChangelogEntries: ChangelogEntry[] = [
  {
    id: 'cl-entry-1', // Ensure IDs are unique if not using version
    version: '1.2.0',
    date: new Date('2024-01-20T10:00:00Z'),
    author: 'Admin User',
    type: 'feature',
    title: 'Enhanced Admin Panel with Role Management',
    description: 'Major update introducing role-based access control and improved security features.',
    changes: [
      { id: 'cl1-1', type: 'added', description: 'Role-based access control system', component: 'Authentication', impact: 'high' },
      { id: 'cl1-2', type: 'added', description: 'Image upload functionality with drag & drop', component: 'Product Management', impact: 'medium' },
    ],
    tags: ['security', 'ui-improvement', 'major-release']
  },
  {
    id: 'cl-entry-2',
    version: '1.1.0',
    date: new Date('2024-01-15T14:30:00Z'),
    author: 'Store Manager',
    type: 'improvement',
    title: 'Inventory Management Improvements',
    description: 'Enhanced inventory tracking and low stock alerts.',
    changes: [
      { id: 'cl2-1', type: 'added', description: 'Real-time inventory alerts', component: 'Inventory', impact: 'medium' },
      { id: 'cl2-2', type: 'fixed', description: 'Stock count calculation errors', component: 'Inventory', impact: 'high' }
    ],
    tags: ['inventory', 'alerts']
  }
];

/**
 * Service class for managing changelog entries.
 * Assumes a Supabase table named 'changelog_entries' with columns similar to the ChangelogEntry type.
 *
 * Note: This service is currently mocked. Full implementation requires creating the
 * 'changelog_entries' table in Supabase and replacing mock logic with Supabase client calls.
 */
export class ChangelogService {
  /**
   * Fetches changelog entries, with optional filtering and pagination.
   * Entries are sorted by date in descending order by default.
   * @param filters - Optional filters for type, searchTerm, limit, and offset.
   * @returns A promise that resolves to an array of ChangelogEntry objects.
   */
  static async getEntries(filters?: {
    type?: ChangelogEntryType | ''; // Allow empty string for 'all types'
    searchTerm?: string;
    limit?: number;
    offset?: number;
  }): Promise<ChangelogEntry[]> {
    console.warn("ChangelogService.getEntries: Using mocked data. Implement database interaction.", filters);
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // let query = supabase.from('changelog_entries').select('*').order('date', { ascending: false });
    // if (filters?.type) query = query.eq('type', filters.type);
    // if (filters?.searchTerm) {
    //   const search = filters.searchTerm;
    //   query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,version.ilike.%${search}%,author.ilike.%${search}%`);
    // }
    // if (filters?.limit) query = query.limit(filters.limit);
    // if (filters?.offset) query = query.range(filters.offset, filters.offset + filters.limit - 1);
    // const { data, error } = await query;
    // if (error) {
    //   console.error('ChangelogService.getEntries - Error:', error);
    //   throw error;
    // }
    // return (data || []).map(entry => ({...entry, date: new Date(entry.date)})); // Ensure date is a Date object

    let results = [...mockChangelogEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filters?.type) {
        results = results.filter(e => e.type === filters.type);
    }
    if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        results = results.filter(e =>
            e.title.toLowerCase().includes(term) ||
            e.description.toLowerCase().includes(term) ||
            e.version.toLowerCase().includes(term) ||
            e.author.toLowerCase().includes(term) ||
            (e.tags && e.tags.some(tag => tag.toLowerCase().includes(term)))
        );
    }
    // Skipping limit/offset for current mock implementation for simplicity
    return Promise.resolve(results);
  }

  /**
   * Fetches a single changelog entry by its ID or version.
   * @param idOrVersion - The ID or version string of the entry.
   * @returns A promise that resolves to a ChangelogEntry object or null if not found.
   */
  static async getEntry(idOrVersion: string): Promise<ChangelogEntry | null> {
    console.warn(`ChangelogService.getEntry for '${idOrVersion}': Using mocked data.`);
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const { data, error } = await supabase.from('changelog_entries').select('*')
    //   .or(`id.eq.${idOrVersion},version.eq.${idOrVersion}`) // If ID is not version
    //   .maybeSingle();
    // if (error) {
    //   console.error(`ChangelogService.getEntry - Error for ${idOrVersion}:`, error);
    //   if (error.code === 'PGRST116') return null;
    //   throw error;
    // }
    // return data ? {...data, date: new Date(data.date)} : null;
    const entry = mockChangelogEntries.find(e => e.id === idOrVersion || e.version === idOrVersion);
    return Promise.resolve(entry ? {...entry, date: new Date(entry.date)} : null);
  }

  /**
   * Creates a new changelog entry.
   * @param entryData - Data for the new entry. 'id' will be auto-generated or based on version. 'date' should be a string in YYYY-MM-DD format.
   * @returns A promise that resolves to the created ChangelogEntry object.
   */
  static async createEntry(entryData: Omit<ChangelogEntry, 'id' | 'date'> & { date: string }): Promise<ChangelogEntry> {
    console.warn("ChangelogService.createEntry: Using mocked data. No actual database insert.", entryData);
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const entryToInsert = {
    //   ...entryData,
    //   date: new Date(entryData.date).toISOString().split('T')[0], // Ensure date is YYYY-MM-DD for DB
    //   tags: entryData.tags || [],
    //   changes: entryData.changes.map(c => ({...c, id: c.id || crypto.randomUUID() })) // Ensure change items have IDs
    // };
    // delete (entryToInsert as any).id; // Remove id if DB generates it
    // const { data, error } = await supabase.from('changelog_entries').insert(entryToInsert).select().single();
    // if (error || !data) {
    //   console.error('ChangelogService.createEntry - Error:', error);
    //   throw error || new Error("Failed to create changelog entry");
    // }
    // return {...data, date: new Date(data.date)};

    const newEntry: ChangelogEntry = {
        ...entryData,
        id: entryData.version || `custom-${Date.now()}`, // Mock ID generation
        date: new Date(entryData.date), // Convert string date to Date object
        changes: entryData.changes.map((c, i) => ({
            ...c,
            id: c.id || `change-${Date.now()}-${i}` // Ensure each change has an ID
        })),
        tags: entryData.tags || []
    };
    mockChangelogEntries.unshift(newEntry); // Add to top for visibility in mock
    return Promise.resolve(newEntry);
  }

  /**
   * Updates an existing changelog entry.
   * @param id - The ID of the entry to update.
   * @param updates - Partial data to update the entry with. 'date' can be a string in YYYY-MM-DD format.
   * @returns A promise that resolves to the updated ChangelogEntry object or null if not found.
   */
  static async updateEntry(id: string, updates: Partial<Omit<ChangelogEntry, 'id' | 'date'> & { date?: string }>): Promise<ChangelogEntry | null> {
    console.warn(`ChangelogService.updateEntry for ID '${id}': Using mocked data.`, updates);
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const updateData = {...updates};
    // if (updates.date) updateData.date = new Date(updates.date).toISOString().split('T')[0];
    // if (updates.tags) updateData.tags = updates.tags || [];
    // if (updates.changes) updateData.changes = updates.changes.map(c => ({...c, id: c.id || crypto.randomUUID()}));

    // const { data, error } = await supabase.from('changelog_entries').update(updateData).eq('id', id).select().single();
    // if (error || !data) {
    //    if (error && error.code === 'PGRST116') return null; // Not found
    //   console.error(`ChangelogService.updateEntry - Error for ID ${id}:`, error);
    //   throw error || new Error("Failed to update changelog entry");
    // }
    // return {...data, date: new Date(data.date)};

    const index = mockChangelogEntries.findIndex(e => e.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedEntry = {
        ...mockChangelogEntries[index],
        ...updates,
        date: updates.date ? new Date(updates.date) : new Date(mockChangelogEntries[index].date),
        tags: updates.tags || mockChangelogEntries[index].tags,
        changes: updates.changes ? updates.changes.map((c,i) => ({...c, id: c.id || `chg-upd-${Date.now()}-${i}`})) as ChangeItem[] : mockChangelogEntries[index].changes,
    };
    mockChangelogEntries[index] = updatedEntry;
    return Promise.resolve(updatedEntry);
  }

  /**
   * Deletes a changelog entry.
   * @param id - The ID of the entry to delete.
   * @returns A promise that resolves to true if deletion was successful, false otherwise.
   */
  static async deleteEntry(id: string): Promise<boolean> {
    console.warn(`ChangelogService.deleteEntry for ID '${id}': Using mocked data.`);
    // TODO: Replace mock with actual Supabase call.
    // Example:
    // const { error } = await supabase.from('changelog_entries').delete().eq('id', id);
    // if (error) {
    //   console.error(`ChangelogService.deleteEntry - Error for ID ${id}:`, error);
    //   throw error;
    // }
    // return !error;
    const initialLength = mockChangelogEntries.length;
    mockChangelogEntries = mockChangelogEntries.filter(e => e.id !== id);
    return Promise.resolve(mockChangelogEntries.length < initialLength);
  }
}
