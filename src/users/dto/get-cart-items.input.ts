import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetCartItems {
    @Field({ description: "user ID" })
    userId: string
}