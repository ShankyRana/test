import { Field, InputType, ObjectType } from 'type-graphql';
import { Bike } from 'app/src/bikes/model/model';
import { User } from 'app/src/users/model/model';

/**
 * User response type
 */

@ObjectType()
class BookedSlotOutput {
  @Field((type) => Date, { nullable: true })
  startDate?: Date | undefined;

  @Field((type) => Date, { nullable: true })
  endDate?: Date;
}


@ObjectType()
export class BookingOutput {
  @Field(type => String, { nullable: true })
  _id: string;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => User, { nullable: true })
  bookedBy: User;

  @Field(type => Bike, { nullable: true })
  bookedBike: Bike;

  @Field((type) => BookedSlotOutput, { nullable: true })
  bookedSlot?: BookedSlotOutput;

  @Field((type) => Date, { nullable: true })
  createdAt?: Date;

}

@InputType()
export class BookedSlotInput {
  @Field((type) => Date, { nullable: true })
  startDate?: Date | undefined;

  @Field((type) => Date, { nullable: true })
  endDate?: Date;
}

@InputType()
export class CreateBookingInput {
  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  bookedBy: string;

  @Field(type => String, { nullable: true })
  bookedBike: string;

  @Field(type => BookedSlotInput, { nullable: true })
  bookedSlot: BookedSlotInput;
}

@InputType()
export class BookingsInput {
  @Field(type => String, { nullable: true })
  _id: string;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  bookedBy: string;

  @Field(type => String, { nullable: true })
  bookedBike: string;

  @Field(type => BookedSlotInput, { nullable: true })
  bookedSlot: BookedSlotInput;
}