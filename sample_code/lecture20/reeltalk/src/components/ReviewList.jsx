import styles from './ReviewList.module.css';

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className={styles.empty}>No reviews yet — be the first.</p>;
  }

  const sorted = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ul className={styles.list}>
      {sorted.map((review) => (
        <li key={review.id} className={styles.review}>
          <div className={styles.header}>
            <strong>{review.reviewerName}</strong>
            <span>{'⭐'.repeat(review.rating)}</span>
          </div>
          <p>{review.body}</p>
        </li>
      ))}
    </ul>
  );
}
