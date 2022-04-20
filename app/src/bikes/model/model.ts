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
 * user qraphql & typegoose type
 */

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
class Rating {
  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  userId?: string;


  @Field((type) => Number, { nullable: true })
  @Property({ type: Number })
  rate?: number;
}

/**
 * User Model
 */
@ObjectType()
@modelOptions({
  schemaOptions: {
    toObject: { getters: true, virtuals: true },
    toJSON: { getters: true, virtuals: true }
  },
})
export class Bike {
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
  color?: string;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  location?: string;

  @Field((type) => Boolean, { nullable: true })
  @Property({ type: Boolean })
  availability?: boolean;

  @Field((type) => [Rating], { nullable: true })
  @Property({ type: [Rating] })
  rating?: Rating[];

}

export const Bikes = getModelForClass(Bike);
