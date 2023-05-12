import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductFindOptions {
  @Field(() => Int, { description: 'Limit the number of received Products...' })
  limit: number;

  @Field(() => Int, { description: 'skip the number of the Products...' })
  skip: number;
}
