import { HabitService } from "../habitService";

export async function createHabitTracker({ habitName }) {
  try {
    // Ensure this only runs on server side
    if (typeof window !== "undefined") {
      console.warn(
        "createHabitTracker should only be called on the server side, using fallback data",
      );
      throw new Error("Server-side only");
    }
    // Check if habit already exists
    const existingHabit = await HabitService.getHabitByName(habitName);

    if (existingHabit) {
      console.log(
        `Habit "${habitName}" already exists, returning existing habit`,
      );
      return {
        habitName: existingHabit.habitName,
        initialDate: existingHabit.initialDate,
      };
    }

    // Create new habit in database
    const newHabit = await HabitService.createHabit({
      habitName,
      initialDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    });

    console.log(`Created new habit: ${habitName}`);

    return {
      habitName: newHabit.habitName,
      initialDate: newHabit.initialDate,
    };
  } catch (error) {
    console.error(`Error creating habit tracker for "${habitName}":`, error);

    // Return fallback response if database fails
    return {
      habitName,
      initialDate: new Date().toISOString().split("T")[0],
    };
  }
}
