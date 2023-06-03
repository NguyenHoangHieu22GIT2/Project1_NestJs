import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Rating {
  @Field({ description: '_id', nullable: true })
  _id?: string;
  @Field({ description: 'title' })
  title: string;
  @Field({ description: 'Rating' })
  rating: string;
  @Field(() => Int, { description: 'stars' })
  stars: number;
  @Field(() => String, { description: 'userId' })
  userId: string | User;
  @Field(() => Date, { description: 'Date' })
  createdAt: Date;
  @Field(() => [String], {
    description: 'upvote of the rating',
    defaultValue: [],
    nullable: true,
  })
  upvote: string[];
  @Field(() => [String], {
    description: 'downvote of the rating',
    defaultValue: [],
    nullable: true,
  })
  downvote: string[];
}
