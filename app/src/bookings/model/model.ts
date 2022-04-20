/* eslint max-classes-per-file: ["error", 20] */

import {
  prop as Property,
  getModelForClass,
  modelOptions,
  setGlobalOptions,
  Severity,
} from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { ObjectID } from 'mongodb';

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

/**
 * Booking qraphql & typegoose type
 */

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
class BookedSlot {
  @Field((type) => Date, { nullable: true })
  @Property({ type: Date })
  startDate?: Date | undefined;

  @Field((type) => Date, { nullable: true })
  @Property({ type: Date })
  endDate?: Date;
}

/**
 * Booking Model
 */
@ObjectType()
@modelOptions({
  schemaOptions: {
    toObject: { getters: true, virtuals: true },
    toJSON: { getters: true, virtuals: true }
  },
})
export class Booking {
  @Field((type) => String, { nullable: true })
  @Property({ default: () => new ObjectID() })
  readonly _id: string;

  @Field((type) => Date, { nullable: true })
  @Property({ type: Date, default: new Date() })
  createdAt?: Date;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  name?: string;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  bookedBy?: string;

  @Field((type) => BookedSlot, { nullable: true })
  @Property({ type: BookedSlot })
  bookedSlot?: BookedSlot;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  bookedBike?: string;

}

export const Bookings = getModelForClass(Booking);
