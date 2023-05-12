import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class Csrf {
  @Field({ description: 'The Token CSRF' })
  @Prop({ required: true, type: String })
  token: string;

  @Field({ description: 'The User Id' })
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;
}

export const CsrfSchema = SchemaFactory.createForClass(Csrf);
