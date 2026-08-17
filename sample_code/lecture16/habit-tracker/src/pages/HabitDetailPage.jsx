import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { computeStreak } from '../utils/streak';

export default function HabitDetailPage() {
  const { id } = useParams();
  const habits = useSelector((state) => state.habits.items);

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div>
        <p>Habit not found.</p>
        <Link to="/habits">Back to habits</Link>
      </div>
    );
  }

  const sortedCheckIns = [...habit.checkIns].sort((a, b) => b.localeCompare(a));

  return (
    <div className="habit-detail-page">
      <Link to="/habits">&larr; Back to habits</Link>
      <h1>{habit.name}</h1>
      <p>
        Category: {habit.category} · Current streak: 🔥 {computeStreak(habit.checkIns)} days
      </p>

      <h2>Check-in history</h2>
      <ul>
        {sortedCheckIns.map((date) => (
          <li key={date}>{date}</li>
        ))}
      </ul>
    </div>
  );
}
