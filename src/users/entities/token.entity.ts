import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class jwtToken {
  @Field({ description: 'Access Token for user loggedin' })
  access_token: string;

  @Field({ description: 'User ID' })
  userId: string;
  @Field({ description: 'Username' })
  username: string;
  @Field({ description: 'avatar' })
  avatar: string;
  @Field({ description: 'email' })
  email: string;
}
