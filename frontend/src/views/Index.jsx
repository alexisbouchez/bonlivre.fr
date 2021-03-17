import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Redirect } from 'react-router-dom';

import Image from './index.svg';

export default function Index() {
  const [search, setSearch] = useState('');
  const [isRedirected, setIsRedirect] = useState(false);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRedirect(true);
  };

  if (isRedirected) {
    return (
      <Redirect
        to={{
          pathname: '/search',
          state: {
            search,
          },
        }}
      />
    );
  }

  return (
    <>
      <section className='hero is-fullheight'>
        <div className='hero-body'>
          <div className='container'>
            <div className='columns  is-vcentered reverse-columns'>
              <div
                className='column
          is-10-mobile is-offset-1-mobile
          is-10-tablet is-offset-1-tablet
          is-5-desktop is-offset-1-desktop
          is-5-widescreen is-offset-1-widescreen
          is-5-fullhd is-offset-1-fullhd'
                data-aos='fade-down'
              >
                <h1 className='title is-1' style={{ color: '#2f2519' }}>
                  <span className='has-text-weight-normal'>Bon</span>
                  Livre
                </h1>

                <h2 className='subtitle has-text-grey is-4 has-text-weight-normal'>
                  Notez, commentez et sauvegardez vos lectures.
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className='control has-icons-left'>
                    <input
                      type='text'
                      className='input is-large'
                      placeholder='Trouver un livre'
                      onChange={handleChange}
                    />
                    <span className='icon is-left'>
                      <FaSearch />
                    </span>
                  </div>
                </form>
              </div>
              <div
                data-aos='fade-right'
                className='column
          is-10-mobile is-offset-1-mobile
          is-10-tablet is-offset-1-tablet
          is-4-desktop is-offset-1-desktop
          is-4-widescreen is-offset-1-widescreen
          is-4-fullhd is-offset-1-fullhd'
              >
                <figure className='image is-square'>
                  <img src={Image} alt='book' />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
