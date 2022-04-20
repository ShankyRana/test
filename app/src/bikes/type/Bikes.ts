import { Field, InputType } from 'type-graphql';

/**
 * User response type
 */


@InputType()
export class CreateBikeInput {

  @Field(type => String, { nullable: true })
  color: string;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => Boolean, { nullable: true })
  availability: boolean;

  @Field(type => String, { nullable: true })
  location: string;

}

@InputType()
export class RatingInput {
  @Field(type => String, { nullable: true })
  userId: string;

  @Field(type => Number, { nullable: true })
  rate: number;
}

@InputType()
export class BikesInput {
  @Field(type => String, { nullable: true })
  _id: string;

  @Field(type => String, { nullable: true })
  color: string;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => Boolean, { nullable: true })
  availability: boolean;

  @Field(type => String, { nullable: true })
  location: string;

  @Field(type => [RatingInput], { nullable: true })
  rating: RatingInput[];
}