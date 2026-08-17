import { memo } from 'react';
import { Link } from 'react-router-dom';
import { computeStreak } from '../utils/streak';
import { todayKey } from '../utils/date';

// Wrapped in React.memo: when one habit is checked in, only THIS item's
// props actually change. Watch the console — unaffected siblings should NOT
// log a re-render. This only works because HabitsListPage updates state
// immutably (see handleCheckIn) and passes a stable `onCheckIn` reference.
const HabitListItem = memo(function HabitListItem({ habit, onCheckIn }) {
  console.log(`Rendering HabitListItem: ${habit.name}`);

  const streak = computeStreak(habit.checkIns);
  const checkedInToday = habit.checkIns.includes(todayKey());

  return (
    <li className="habit-item">
      <Link to={`/habits/${habit.id}`}>{habit.name}</Link>
      <span className="habit-item__category">{habit.category}</span>
      <span className="habit-item__streak">🔥 {streak}</span>
      <button
        type="button"
        disabled={checkedInToday}
        onClick={() => onCheckIn(habit.id)}
      >
        {checkedInToday ? 'Checked in' : 'Check in'}
      </button>
    </li>
  );
});

export default HabitListItem;
