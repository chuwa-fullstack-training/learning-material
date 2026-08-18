export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="review-list__empty">No reviews yet — be the first.</p>;
  }

  const sorted = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ul className="review-list">
      {sorted.map((review) => (
        <li key={review.id} className="review">
          <div className="review__header">
            <strong>{review.reviewerName}</strong>
            <span>{'⭐'.repeat(review.rating)}</span>
          </div>
          <p>{review.body}</p>
        </li>
      ))}
    </ul>
  );
}
