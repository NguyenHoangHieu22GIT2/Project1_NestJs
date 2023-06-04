import { Rating } from 'src/products/entities/rating.type';
import { User } from 'src/users/entities/user.entity';

export function getLatestCreatedRating(ratings: Rating[], user: User) {
  let date: Date;
  ratings.forEach((curRating, index) => {
    if (typeof curRating.userId == 'object') {
      if (!date && curRating.userId._id.toString() === user._id.toString()) {
        date = curRating.createdAt;
      }
      if (
        date &&
        date.getTime() < curRating.createdAt.getTime() &&
        curRating.userId._id.toString() === user._id.toString()
      ) {
        date = curRating.createdAt;
      }
    }
  });
  return date;
}

export function getRating(ratings: Rating[], date: Date) {
  let rating = ratings.filter((rating: Rating) => {
    if (date.getTime() === rating.createdAt.getTime()) {
      return rating;
    }
  });
  rating[0].userId = JSON.stringify(rating[0].userId);
  return rating[0];
}
