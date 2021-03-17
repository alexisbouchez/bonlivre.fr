import React, { Component, useState } from 'react';
import Cookies from 'js-cookie';

export default class Notification extends Component {
  constructor() {
    super();

    this.state = {
      isHidden: false,
    };

    this.hide = this.hide.bind(this);
  }

  hide() {
    const { onHide } = this.props;
    this.setState({ isHidden: true });
    if (typeof onHide === 'function') {
      onHide();
    }
  }

  render() {
    return (
      <>
        {!this.state.isHidden && (
          <div className={`notification is-${this.props.status}`}>
            <button className='delete' onClick={this.hide} />
            {this.props.children}
          </div>
        )}
      </>
    );
  }
}

export function CookieNotification() {
  const [cookie, setCookie] = useState(Cookies.get('accept-cookies-policy'));

  const handleHide = () => {
    setCookie('accept');
    Cookies.set('accept-cookies-policy', 'accept', { expires: 365 });
  };

  return (
    <>
      {!cookie && (
        <Notification onHide={handleHide}>
          Ce site utilise des cookies à des fins utilitaires et non
          publicitaires.
        </Notification>
      )}
    </>
  );
}
