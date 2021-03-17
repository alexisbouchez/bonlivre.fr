import React from 'react';

export default function PaginationBis({ page, numberOfPages, setPage }) {
  page = parseInt(page);

  return (
    <nav
      className='pagination is-centered'
      role='navigation'
      aria-label='pagination'
    >
      <p
        className='pagination-link previous'
        disabled={page - 1 <= 0 ? true : null}
        onClick={() => setPage(page - 1)}
      >
        Précedent
      </p>

      <p
        className='pagination-next'
        disabled={page + 1 > numberOfPages ? true : null}
        onClick={() => setPage(page + 1)}
      >
        Suivant
      </p>

      <ul className='pagination-list'>
        {page >= 3 && (
          <>
            <li>
              <p className='pagination-link' onClick={() => setPage(1)}>
                1
              </p>
            </li>
            {numberOfPages > 3 && (
              <li>
                <span className='pagination-ellipsis'>&hellip;</span>
              </li>
            )}
          </>
        )}

        {page - 1 >= 1 && (
          <li>
            <p className='pagination-link' onClick={() => setPage(page - 1)}>
              {page - 1}
            </p>
          </li>
        )}
        <li>
          <p className='pagination-link is-current'>{page}</p>
        </li>
        {page + 1 <= numberOfPages && (
          <li>
            <p className='pagination-link' onClick={() => setPage(page + 1)}>
              {page + 1}
            </p>
          </li>
        )}

        {page < numberOfPages - 1 && (
          <>
            {numberOfPages > 3 && (
              <li>
                <span className='pagination-ellipsis'>&hellip;</span>
              </li>
            )}
            <li>
              <p
                className='pagination-link'
                onClick={() => setPage(numberOfPages)}
              >
                {numberOfPages}
              </p>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
