import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkIn } from '../store/habitsSlice';
import { computeStreak } from '../utils/streak';
import { todayKey } from '../utils/date';

// Still wrapped in React.memo — but notice what's NOT here anymore: no
// `onCheckIn` prop threaded down from a parent that had to remember to
// wrap it in useCallback (compare to L15). `useDispatch()` always returns
// the same stable function, so this component can talk to the store
// directly without breaking memoization for its siblings.
const HabitListItem = memo(function HabitListItem({ habit }) {
  console.log(`Rendering HabitListItem: ${habit.name}`);

  const dispatch = useDispatch();
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
        onClick={() => dispatch(checkIn(habit.id))}
      >
        {checkedInToday ? 'Checked in' : 'Check in'}
      </button>
    </li>
  );
});

export default HabitListItem;
