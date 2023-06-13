import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ProductCountInput {
    @Field({ description: 'Filter Words', nullable: true })
    words: string;
    @Field({description:"Find all products of one user",nullable:true})
    userId:string
}