import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Options {
  @Field({ description: 'optionName' })
  optionName: string;
  @Field(() => Float, { description: 'Price' })
  price: number;
}

@InputType()
export class OptionsType {
  @Field({ description: 'optionName' })
  optionName: string;
  @Field(() => Float, { description: 'Price' })
  price: number;
}
