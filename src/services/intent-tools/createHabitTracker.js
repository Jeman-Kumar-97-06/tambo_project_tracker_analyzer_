export async function createHabitTracker({ habitName }) {
  return {
    habitName,
    initialDate: new Date().toLocaleDateString(),
  };
}
