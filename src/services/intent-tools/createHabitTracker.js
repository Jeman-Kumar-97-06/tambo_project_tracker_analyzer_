export async function createHabitTracker({ habit }) {
  return {
    habitName: habit,
    initialDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}
