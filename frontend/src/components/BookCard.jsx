import React from 'react';
import { Link } from 'react-router-dom';

function BookCard({ id, title, author, publicationDate, css }) {
  return (
    <div className={`${css} box book-card`}>
      <div className='mr-4 ml-4'>
        <Link to={`/book/${id}`}>
          <h1 className='title is-5'>
            {title} ({publicationDate})
          </h1>
          <p className='subtitle is-6'>{author}</p>
        </Link>
      </div>
    </div>
  );
}

export default BookCard;
