import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindFavoriteProduct {
    @Field({ description: "userId" })
    userId: string

    @Field({ description: "Limit of favorite Products" })
    limit: number

    @Field({ description: "Skip products" })
    skip: number
}