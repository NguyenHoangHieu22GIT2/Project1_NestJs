import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CheckTokenInput {
  @Field({ description: 'The Token To Check' })
  token: string;
  @Field({ description: 'The userId To Check' })
  userId: string;
}
