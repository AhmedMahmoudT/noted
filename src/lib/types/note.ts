export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  isPreview?: boolean; // Track view mode per note
}
