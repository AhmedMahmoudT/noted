import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";
import { Note } from "@/lib/types/note";

const NOTES_COLLECTION = "notes";

export const NoteService = {
  // Create a new note
  createNote: async (userId: string, activeNoteId?: string): Promise<Note> => {
    const newNote = {
      title: "",
      content: "",
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, NOTES_COLLECTION), newNote);

    // We explicitly return the Note object with the new ID
    // Timestamps will be estimates for immediate UI use until sync
    return {
      id: docRef.id,
      title: "",
      content: "",
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  // Update a note
  updateNote: async (noteId: string, data: Partial<Note>) => {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Subscribe to user's notes
  subscribeToNotes: (userId: string, onUpdate: (notes: Note[]) => void) => {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          content: data.content || "",
          userId: data.userId,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : Date.now(),
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toMillis()
              : Date.now(),
        } as Note;
      });
      onUpdate(notes);
    });
  },
};
