import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductFindOptions {
  @Field(() => Int, {
    description: 'Limit the number of received Products...',
    nullable: true,
  })
  limit: number;

  @Field(() => Int, {
    description: 'skip the number of the Products...',
    nullable: true,
  })
  skip: number;

  @Field({ description: 'Filter Words', nullable: true })
  words: string;

  @Field({
    description: 'ProductId so That we can find related Product',
    nullable: true,
  })
  productId: string;
}
