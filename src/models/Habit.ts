import { ObjectId } from 'mongodb';

export interface Habit {
  _id?: ObjectId;
  habitName: string;
  initialDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  _id?: ObjectId;
  habitId: ObjectId;
  habitName: string;
  date: string;
  completed: number; // 1 for completed, 0 for missed
  reason?: string; // Optional reason for missing
  createdAt: Date;
  updatedAt: Date;
}

export const HABIT_COLLECTION = 'habits';
export const HABIT_ENTRIES_COLLECTION = 'habit_entries';
