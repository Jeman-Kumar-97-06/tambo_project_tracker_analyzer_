import { connectToDatabase } from "@/lib/mongodb";
import {
  Habit,
  HabitEntry,
  HABIT_COLLECTION,
  HABIT_ENTRIES_COLLECTION,
} from "@/models/Habit";
import { ObjectId } from "mongodb";

export class HabitService {
  // Create a new habit
  static async createHabit(
    habitData: Omit<Habit, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Habit> {
    const { db } = await connectToDatabase();

    const habit: Habit = {
      ...habitData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(HABIT_COLLECTION).insertOne(habit);
    return { ...habit, _id: result.insertedId };
  }

  // Get all habits
  static async getAllHabits(): Promise<Habit[]> {
    const { db } = await connectToDatabase();
    const habits = await db.collection(HABIT_COLLECTION).find({}).toArray();
    return habits as Habit[];
  }

  // Get habit by ID
  static async getHabitById(id: string): Promise<Habit | null> {
    const { db } = await connectToDatabase();
    const habit = await db
      .collection(HABIT_COLLECTION)
      .findOne({ _id: new ObjectId(id) });
    return habit as Habit | null;
  }

  // Get habit by name
  static async getHabitByName(habitName: string): Promise<Habit | null> {
    const { db } = await connectToDatabase();
    const habit = await db.collection(HABIT_COLLECTION).findOne({ habitName });
    return habit as Habit | null;
  }

  // Update habit
  static async updateHabit(
    id: string,
    updateData: Partial<Omit<Habit, "_id" | "createdAt">>,
  ): Promise<Habit | null> {
    const { db } = await connectToDatabase();

    const result = await db.collection(HABIT_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    return result?.value as Habit | null;
  }

  // Delete habit
  static async deleteHabit(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();

    // Also delete all habit entries for this habit
    await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .deleteMany({ habitId: new ObjectId(id) });

    const result = await db
      .collection(HABIT_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Add habit entry (daily completion record)
  static async addHabitEntry(
    entryData: Omit<HabitEntry, "_id" | "createdAt" | "updatedAt">,
  ): Promise<HabitEntry> {
    const { db } = await connectToDatabase();

    const entry: HabitEntry = {
      ...entryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .insertOne(entry);
    return { ...entry, _id: result.insertedId };
  }

  // Get habit entries by habit ID
  static async getHabitEntries(
    habitId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HabitEntry[]> {
    const { db } = await connectToDatabase();

    let query: any = { habitId: new ObjectId(habitId) };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const entries = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .find(query)
      .sort({ date: 1 })
      .toArray();

    return entries as HabitEntry[];
  }

  // Get habit entries by habit name
  static async getHabitEntriesByName(
    habitName: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HabitEntry[]> {
    const { db } = await connectToDatabase();

    let query: any = { habitName };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const entries = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .find(query)
      .sort({ date: 1 })
      .toArray();

    return entries as HabitEntry[];
  }

  // Update habit entry
  static async updateHabitEntry(
    id: string,
    updateData: Partial<Omit<HabitEntry, "_id" | "createdAt">>,
  ): Promise<HabitEntry | null> {
    const { db } = await connectToDatabase();

    const result = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

    return result?.value as HabitEntry | null;
  }

  // Delete habit entry
  static async deleteHabitEntry(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Get habit completion statistics
  static async getHabitStats(
    habitId: string,
    days: number = 30,
  ): Promise<{
    totalDays: number;
    completedDays: number;
    completionRate: number;
    streak: number;
    longestStreak: number;
    commonReasons: { reason: string; count: number }[];
  }> {
    const { db } = await connectToDatabase();

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const entries = await this.getHabitEntries(habitId, startDate, endDate);

    const totalDays = entries.length;
    const completedDays = entries.filter(
      (entry) => entry.completed === 1,
    ).length;
    const completionRate =
      totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    // Calculate current streak
    let streak = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].completed === 1) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;
    for (const entry of entries) {
      if (entry.completed === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Get common reasons for missing
    const reasonCounts: { [key: string]: number } = {};
    entries
      .filter((entry) => entry.completed === 0 && entry.reason)
      .forEach((entry) => {
        const reason = entry.reason!;
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });

    const commonReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalDays,
      completedDays,
      completionRate,
      streak,
      longestStreak,
      commonReasons,
    };
  }

  // Get today's habit entry
  static async getTodayHabitEntry(habitId: string): Promise<HabitEntry | null> {
    const today = new Date().toISOString().split("T")[0];
    const entries = await this.getHabitEntries(habitId, today, today);
    return entries.length > 0 ? entries[0] : null;
  }

  // Mark habit as completed today
  static async markHabitCompleted(
    habitName: string,
    completed: number = 1,
    reason?: string,
  ): Promise<HabitEntry> {
    const today = new Date().toISOString().split("T")[0];

    // Check if entry already exists for today
    const { db } = await connectToDatabase();
    const existingEntry = await db
      .collection(HABIT_ENTRIES_COLLECTION)
      .findOne({
        habitName,
        date: today,
      });

    if (existingEntry) {
      // Update existing entry
      const result = await db
        .collection(HABIT_ENTRIES_COLLECTION)
        .findOneAndUpdate(
          { _id: existingEntry._id },
          {
            $set: {
              completed,
              reason,
              updatedAt: new Date(),
            },
          },
          { returnDocument: "after" },
        );
      return result?.value as HabitEntry;
    } else {
      // Create new entry
      const habit = await this.getHabitByName(habitName);
      if (!habit) {
        throw new Error(`Habit '${habitName}' not found`);
      }

      return await this.addHabitEntry({
        habitId: habit._id!,
        habitName,
        date: today,
        completed,
        reason,
      });
    }
  }
}
