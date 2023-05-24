import { InputType, Field } from '@nestjs/graphql';
import {
  IsStrongPassword,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'email' })
  @IsEmail()
  email: string;

  @Field({ description: 'password' })
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @Field({ description: 'username' })
  @IsString()
  @MinLength(5)
  username: string;

  token?: string
}
