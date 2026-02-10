import { HabitService } from "@/services/habitService";

export interface CreateHabitTrackerInput {
  habitName: string;
}

export interface CreateHabitTrackerOutput {
  habitName: string;
  initialDate: string;
}

export async function createHabitTracker(
  input: CreateHabitTrackerInput,
): Promise<CreateHabitTrackerOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error(
      "createHabitTracker should only be called on the server side",
    );
  }

  try {
    const { habitName } = input;
    const initialDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Create habit in database
    const habit = await HabitService.createHabit({
      habitName,
      initialDate,
    });

    return {
      habitName: habit.habitName,
      initialDate: habit.initialDate,
    };
  } catch (error) {
    console.error("Error creating habit tracker:", error);

    // Return fallback data if database fails
    return {
      habitName: input.habitName,
      initialDate: new Date().toISOString().split("T")[0],
    };
  }
}
