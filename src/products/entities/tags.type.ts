import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagType {
  @Field({ description: 'name' })
  name: string;
  @Field(() => [String], { description: 'Options' })
  options: string[];
}
@InputType()
export class TagInput {
  @Field({ description: 'name' })
  name: string;
  @Field(() => [String], { description: 'Options' })
  options: string[];
}
