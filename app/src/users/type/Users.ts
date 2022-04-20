import { Field, InputType, ObjectType } from 'type-graphql';

import { User } from '../model/model';

/**
 * User response type
 */
@ObjectType()
export class TokenizedResponse {
  @Field()
  user: User;

  @Field(type => String, { nullable: true })
  token: string;

  @Field(type => Number, { nullable: true })
  tokenExpiration: number;
}
@InputType()
export class CreateUserInput {
  @Field((type) => String, { nullable: true })
  _id: string;

  @Field(type => String, { nullable: true })
  email: string;

  @Field(type => String, { nullable: true })
  password: string;

  @Field(type => String, { nullable: true })
  role: string;
}


@InputType()
export class UserInput {
  @Field(type => String, { nullable: false })
  id: string;

  @Field(type => Date, { nullable: true })
  createdAt: any;

  @Field(type => String, { nullable: true })
  password: string;

  @Field(type => String, { nullable: true })
  email: string;

  @Field(type => String, { nullable: true })
  role: string;
}
