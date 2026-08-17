import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { checkIn } from '../store/habitsSlice';
import { computeStreak } from '../utils/streak';
import { todayKey } from '../utils/date';
import type { Habit } from '../types';

interface HabitListItemProps {
  habit: Habit;
}

const HabitListItem = memo(function HabitListItem({ habit }: HabitListItemProps) {
  console.log(`Rendering HabitListItem: ${habit.name}`);

  const dispatch = useAppDispatch();
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
