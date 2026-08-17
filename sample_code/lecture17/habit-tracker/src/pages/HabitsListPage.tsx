import { useAppSelector } from '../store/store';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useViewPreferences } from '../context/ViewPreferencesContext';
import HabitListItem from '../components/HabitListItem';
import type { Category } from '../types';

const ALL = 'all';

export default function HabitsListPage() {
  const habits = useAppSelector((state) => state.habits.items);
  const { state: viewPrefs } = useViewPreferences();

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? ALL;
  const filtered = category === ALL ? habits : habits.filter((h) => h.category === category);

  function handleCategoryChange(next: Category | typeof ALL) {
    if (next === ALL) {
      setSearchParams({});
    } else {
      setSearchParams({ category: next });
    }
  }

  return (
    <div className="habits-list-page">
      <h1>My Habits</h1>

      <div className="category-filter">
        <button
          type="button"
          className={category === ALL ? 'active' : ''}
          onClick={() => handleCategoryChange(ALL)}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={category === cat ? 'active' : ''}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul className={viewPrefs.compact ? 'habit-list habit-list--compact' : 'habit-list'}>
        {filtered.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} />
        ))}
      </ul>
    </div>
  );
}
