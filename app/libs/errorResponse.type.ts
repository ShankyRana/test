import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ErrorResponse {
  @Field()
  message: string;
}