import { useAiSummary } from '../hooks/useAiSummary';
import styles from './AiSummary.module.css';

// "Generate AI summary" — streams a spoiler-free blurb token by token over
// SSE (see hooks/useAiSummary.js and the backend's summarySSE.js). No real
// LLM; the point is the streaming UX, which is exactly why SSE exists.
export default function AiSummary({ movieId }) {
  const { text, status, start } = useAiSummary(movieId);

  return (
    <div className={styles.summary}>
      <button
        type="button"
        className={styles.button}
        onClick={start}
        disabled={status === 'streaming'}
      >
        {status === 'streaming' ? 'Generating…' : '✨ Generate AI summary'}
      </button>

      {text && (
        <p className={status === 'streaming' ? `${styles.text} ${styles.cursor}` : styles.text}>
          {text}
        </p>
      )}
      {status === 'error' && <p className={styles.text}>Failed to generate summary.</p>}
    </div>
  );
}
