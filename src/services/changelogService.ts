import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase'; // If you have a changelog table in your db schema types
import { ChangelogEntry, ChangeItem } from '../types/changelog'; // Using existing types

// Assuming your Supabase schema might have a 'changelog_entries' table
// type ChangelogEntryDB = Database['public']['Tables']['changelog_entries']['Row'];
// type ChangelogEntryInsert = Database['public']['Tables']['changelog_entries']['Insert'];

// For now, we'll use the existing ChangelogEntry type and simulate DB interaction.
// If 'changelog_entries' table was in supabase.ts, we'd use its generated types:
type ChangelogEntryDBRow = Database['public']['Tables'] extends { changelog_entries: infer T } ? T['Row'] : never;
type ChangelogEntryDBInsert = Database['public']['Tables'] extends { changelog_entries: infer T } ? T['Insert'] : never;
type ChangelogEntryDBUpdate = Database['public']['Tables'] extends { changelog_entries: infer T } ? T['Update'] : never;


// Mock data store (simulates a database table).
// This will be removed when Supabase integration is complete.
let mockChangelogEntries: ChangelogEntry[] = [
  {
    id: 'cl-entry-1',
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
 * Assumes a Supabase table named 'changelog_entries' with columns corresponding to the ChangelogEntry type.
 * The 'changes' property is expected to be stored as JSONB in Supabase.
 */
export class ChangelogService {
  private static tableName = 'changelog_entries';

  /**
   * Transforms a database row into an application-level ChangelogEntry object.
   * Specifically converts the date string to a Date object.
   * @param dbEntry - The changelog entry object from the database.
   * @returns A ChangelogEntry object.
   */
  private static_transformDBRowToEntry(dbEntry: ChangelogEntryDBRow): ChangelogEntry {
    return {
      ...dbEntry,
      date: new Date(dbEntry.date), // Ensure date is a Date object
      // `changes` (JSONB) and `tags` (TEXT[]) should be correctly cast by Supabase client.
      // If `changes` items need their `id`s to be strings, ensure they are stored or cast as such.
      changes: (dbEntry.changes as unknown as ChangeItem[]) || [], // Cast if Supabase returns JSON
      tags: dbEntry.tags || [],
    };
  }

  /**
   * Fetches changelog entries from Supabase, with optional filtering and pagination.
   * Entries are sorted by date in descending order by default.
   * @param filters - Optional filters for type, searchTerm, limit, and offset.
   * @returns A promise that resolves to an array of ChangelogEntry objects.
   * @throws Will throw an error if fetching fails.
   */
  static async getEntries(filters?: {
    type?: ChangelogEntryType | '';
    searchTerm?: string;
    limit?: number;
    offset?: number;
  }): Promise<ChangelogEntry[]> {
    let query = supabase.from(this.tableName).select('*').order('date', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      // Example of searching multiple text fields. For JSONB 'changes', FTS or specific JSON operators would be needed.
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,version.ilike.%${term}%,author.ilike.%${term}%,tags.cs.{${term}}`);
    }
    if (filters?.limit !== undefined && filters?.offset !== undefined) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    } else if (filters?.limit !== undefined) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('ChangelogService.getEntries - Error:', error);
      throw error;
    }
    return (data || []).map(this.static_transformDBRowToEntry);
  }

  /**
   * Fetches a single changelog entry by its ID from Supabase.
   * @param id - The ID of the entry.
   * @returns A promise that resolves to a ChangelogEntry object or null if not found.
   * @throws Will throw an error if fetching fails (other than not found).
   */
  static async getEntry(id: string): Promise<ChangelogEntry | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`ChangelogService.getEntry - Error for ID ${id}:`, error);
      // PGRST116 is " بالضبط صف واحد ينتهك سياسة أمان على مستوى الصف للعلاقة" (Row not found for .single())
      // For maybeSingle, error is null if not found, data is null.
      throw error; // Re-throw other errors
    }
    return data ? this.static_transformDBRowToEntry(data) : null;
  }

  /**
   * Creates a new changelog entry in Supabase.
   * @param entryData - Data for the new entry. `id` is typically generated by the DB. `date` should be a string (YYYY-MM-DD).
   * @returns A promise that resolves to the created ChangelogEntry object.
   * @throws Will throw an error if creation fails.
   */
  static async createEntry(entryData: Omit<ChangelogEntryDBInsert, 'id' | 'created_at' | 'updated_at' | 'date'> & { date: string }): Promise<ChangelogEntry> {
    const entryToInsert: ChangelogEntryDBInsert = {
      ...entryData,
      date: new Date(entryData.date).toISOString().split('T')[0], // Store date as YYYY-MM-DD string
      tags: entryData.tags || [],
      // Ensure 'changes' items have IDs if your DB schema for the JSONB doesn't auto-generate them or if you need them client-side.
      // If 'changes.id' is not part of your DB schema for the JSONB, remove it here.
      changes: entryData.changes.map(c => ({ ...c, id: c.id || crypto.randomUUID() })),
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entryToInsert)
      .select()
      .single();

    if (error || !data) {
      console.error('ChangelogService.createEntry - Error:', error);
      throw error || new Error("Failed to create changelog entry or no data returned.");
    }
    return this.static_transformDBRowToEntry(data);
  }

  /**
   * Updates an existing changelog entry in Supabase.
   * @param id - The ID of the entry to update.
   * @param updates - Partial data to update the entry with. `date` can be a string (YYYY-MM-DD).
   * @returns A promise that resolves to the updated ChangelogEntry object or null if not found.
   * @throws Will throw an error if update fails.
   */
  static async updateEntry(id: string, updates: Partial<Omit<ChangelogEntryDBUpdate, 'id' | 'date' | 'created_at' | 'updated_at'> & { date?: string }>): Promise<ChangelogEntry | null> {
    const updateData: Partial<ChangelogEntryDBUpdate> = {...updates};
    if (updates.date) {
      updateData.date = new Date(updates.date).toISOString().split('T')[0];
    }
    if (updates.changes) {
        // Ensure changes items have IDs if necessary for your schema/application logic
        updateData.changes = updates.changes.map(c => ({...c, id: c.id || crypto.randomUUID() })) as any; // Cast to any if type mismatch
    }
    updateData.updated_at = new Date().toISOString();


    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
       if (error && error.code === 'PGRST116') { // Row not found during update.
         console.warn(`ChangelogService.updateEntry - Entry with ID ${id} not found.`);
         return null;
       }
      console.error(`ChangelogService.updateEntry - Error for ID ${id}:`, error);
      throw error || new Error("Failed to update changelog entry or no data returned.");
    }
    return this.static_transformDBRowToEntry(data);
  }

  /**
   * Deletes a changelog entry from Supabase.
   * @param id - The ID of the entry to delete.
   * @returns A promise that resolves to true if deletion was successful.
   * @throws Will throw an error if deletion fails.
   */
  static async deleteEntry(id: string): Promise<boolean> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);
    if (error) {
      console.error(`ChangelogService.deleteEntry - Error for ID ${id}:`, error);
      throw error;
    }
    return true; // If no error, deletion was successful (or row didn't exist, which is fine for delete)
  }
}
