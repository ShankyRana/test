import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  serialize: (value: any): string => {
    if (!(value instanceof ObjectId)) {
      throw new Error('ObjectIdScalar can only serialize ObjectId values');
    }
    return value.toHexString();
  },
  parseValue: (value: unknown): ObjectId => {
    if (typeof value !== 'string') {
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(value);
  },
  parseLiteral: (ast: any): ObjectId => {
    if (ast.kind !== Kind.STRING) { // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(ast.value); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  },
});