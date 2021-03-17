import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { rateBook } from '../API';

import './StarRating.css';

function StarRating({ stars, token, id, score, setScore }) {
  const [rating, setRating] = useState(stars);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setRating(stars);
  }, [stars]);

  const handleClick = async (rating) => {
    setRating(rating);
    const res = await rateBook(token, id, rating);
    const { error, score } = res;

    if (error) {
      setError(error);
    }

    if (score) {
      setScore(score);
    }
  };

  return (
    <div>
      {error && <p className='has-text-danger'>{error}</p>}

      {[...Array(5)].map((_, key) => (
        <label key={key}>
          {!token && (
            <FaStar
              className='star'
              color={key + 1 <= (hover || rating) ? '#cbaf87' : '#e4e5e9'}
              size={20}
            />
          )}

          {token && (
            <>
              <input
                type='radio'
                name='rating'
                value={key + 1}
                onClick={() => handleClick(key + 1)}
              />

              <FaStar
                className='star'
                color={key + 1 <= (hover || rating) ? '#cbaf87' : '#e4e5e9'}
                size={20}
                onMouseEnter={() => setHover(key + 1)}
                onMouseLeave={() => setHover(null)}
              />
            </>
          )}
        </label>
      ))}
      {typeof score === 'number' && <>({Math.round(score * 100) / 100})</>}
    </div>
  );
}

export default StarRating;
