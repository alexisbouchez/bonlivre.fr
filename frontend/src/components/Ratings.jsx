import React, { Component } from 'react';
import Rating from './Rating';
import CommentInput from './CommentInput';

export default class Ratings extends Component {
  delete = (ratingId) => {
    this.props.updateRatings(
      this.props.ratings.filter((rating) => rating.id !== ratingId)
    );
  };

  insert = (newRating) => {
    const { ratings } = this.props;
    ratings.push(newRating);
    this.props.updateRatings(ratings);
  };

  render() {
    const { bookID, token, ratings, stars } = this.props;

    return (
      <div>
        <CommentInput
          id={bookID}
          token={token}
          insert={this.insert}
          stars={stars}
        />

        <br />

        {ratings.map((rating, key) => (
          <Rating
            key={key}
            comment={rating.comment}
            username={rating.username}
            stars={rating.stars}
            ratingId={rating.id}
            isOwned={rating.isOwned}
            delete={this.delete}
          />
        ))}
      </div>
    );
  }
}
