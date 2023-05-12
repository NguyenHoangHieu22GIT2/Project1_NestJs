import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCsrfInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
