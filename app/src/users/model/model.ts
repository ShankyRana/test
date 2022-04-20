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
export class User {
  @Field((type) => String, { nullable: true })
  @Property({ default: () => new ObjectID() })
  readonly _id: string;

  @Field((type) => Date, { nullable: true })
  @Property({ type: Date, default: new Date() })
  createdAt?: Date;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  email?: string;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  name?: string;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  password?: string;

  @Field((type) => String, { nullable: true })
  @Property({ type: String })
  role?: string;
}

export const Users = getModelForClass(User);
