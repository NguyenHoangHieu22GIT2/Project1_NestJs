import { CreateCsrfInput } from './create-csrf.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCsrfInput extends PartialType(CreateCsrfInput) {
  @Field(() => Int)
  id: number;
}
