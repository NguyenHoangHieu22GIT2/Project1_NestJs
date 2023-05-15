import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductFindOptions {
  @Field(() => Int, { description: 'Limit the number of received Products...' })
  limit: number;

  @Field(() => Int, { description: 'skip the number of the Products...' })
  skip: number;

  @Field({ description: 'Filter Words', nullable: true })
  words: string;

  @Field({
    description: 'ProductId so That we can find related Product',
    nullable: true,
  })
  productId: string;
}
