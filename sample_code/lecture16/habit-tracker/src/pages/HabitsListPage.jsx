import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/habits';
import { useViewPreferences } from '../context/ViewPreferencesContext';
import HabitListItem from '../components/HabitListItem';

const ALL = 'all';

export default function HabitsListPage() {
  // Redux for the shared domain data...
  const habits = useSelector((state) => state.habits.items);
  // ...Context for a simple, local UI preference. Different tools, on
  // purpose — see App.jsx.
  const { state: viewPrefs } = useViewPreferences();

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? ALL;
  const filtered = category === ALL ? habits : habits.filter((h) => h.category === category);

  function handleCategoryChange(next) {
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
