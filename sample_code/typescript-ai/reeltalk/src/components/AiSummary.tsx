import { useAiSummary } from '../hooks/useAiSummary';
import styles from './AiSummary.module.css';

interface AiSummaryProps {
  movieId: string;
}

// Every branch below is reachable only because `state.status` narrows the
// discriminated union from useAiSummary.ts — `state.rating` and
// `state.tags` are only visible to TypeScript once `status === 'done'`.
export default function AiSummary({ movieId }: AiSummaryProps) {
  const { state, start } = useAiSummary(movieId);

  return (
    <div className={styles.summary}>
      <button
        type="button"
        className={styles.button}
        onClick={start}
        disabled={state.status === 'streaming'}
      >
        {state.status === 'streaming' ? 'Generating…' : '✨ Generate AI summary'}
      </button>

      {(state.status === 'streaming' || state.status === 'done') && (
        <p className={state.status === 'streaming' ? `${styles.text} ${styles.cursor}` : styles.text}>
          {state.verdict}
        </p>
      )}

      {state.status === 'done' && (
        <p className={styles.text}>
          {'⭐'.repeat(state.rating)} · {state.tags.join(', ')}
        </p>
      )}

      {state.status === 'error' && <p className={styles.text}>{state.message}</p>}
    </div>
  );
}
