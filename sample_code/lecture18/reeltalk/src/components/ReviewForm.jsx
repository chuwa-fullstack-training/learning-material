import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW_MUTATION } from '../queries';
import { appendReviewToCache } from '../cache/appendReview';

export default function ReviewForm({ movieId }) {
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');

  const [createReview, { loading, error }] = useMutation(CREATE_REVIEW_MUTATION, {
    // Precise cache update instead of refetchQueries — see cache/appendReview.js.
    update(cache, { data }) {
      if (data?.createReview) appendReviewToCache(cache, data.createReview);
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!reviewerName.trim() || !body.trim()) return;

    await createReview({
      variables: { movieId, reviewerName: reviewerName.trim(), rating, body: body.trim() },
    });
    setBody('');
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={reviewerName}
        onChange={(e) => setReviewerName(e.target.value)}
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {'⭐'.repeat(n)}
          </option>
        ))}
      </select>
      <textarea
        placeholder="What did you think? (no spoilers!)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post review'}
      </button>
      {error && <p className="review-form__error">Error: {error.message}</p>}
    </form>
  );
}
