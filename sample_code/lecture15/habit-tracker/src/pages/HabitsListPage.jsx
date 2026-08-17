import { useOutletContext, useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/habits';
import HabitListItem from '../components/HabitListItem';

const ALL = 'all';

export default function HabitsListPage() {
  const { habits, onCheckIn } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? ALL;
  const filtered = category === ALL ? habits : habits.filter((h) => h.category === category);

  function handleCategoryChange(next) {
    // Shareable/bookmarkable: this filter now lives in the URL
    // (/habits?category=health), not just in component state.
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

      <ul className="habit-list">
        {filtered.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} onCheckIn={onCheckIn} />
        ))}
      </ul>
    </div>
  );
}
