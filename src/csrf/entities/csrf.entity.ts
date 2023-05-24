import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Csrf {
  @Field({ description: 'The Token CSRF' })
  @Prop({ required: true, type: String })
  token: string;

  @Field({ description: 'The User Id' })
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Field(() => Date, { description: 'Created At' })
  createdAt?: Date

  @Prop()
  @Field(() => Date, { description: 'Updated At' })
  updatedAt?: Date
}

const CsrfSchema = SchemaFactory.createForClass(Csrf);

// CsrfSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

export { CsrfSchema };
