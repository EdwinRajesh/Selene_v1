export interface JournalEntry {
    id: string; // Unique identifier for the journal entry
    title: string; // Title of the journal entry
    content: string; // Content of the journal entry
    date: string; // Date of the journal entry in ISO format (e.g., YYYY-MM-DD)
    time: string; // Time of the journal entry in ISO format (e.g., HH:mm:ss)
    images?: string[]; // Optional array of image URLs associated with the journal entry
    tags?: string[]; // Optional array of tags associated with the journal entry
  }