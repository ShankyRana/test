import { GraphQLScalarType, Kind } from 'graphql';


export const JSONCustomScalarType = new GraphQLScalarType({
  name: 'JSONCustomScalarType',
  description: 'Converts string json to json',
  serialize: (value: any) => {
    if (!value) {
      throw new Error('JSONCustomScalarType can only serialize string JSON values');
    }

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  },
  parseValue: (value: any) => {

    if (!value) {
      throw new Error('JSONCustomScalarType can only parse string object values');
    }

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  },
  parseLiteral: (ast: any) => {
    if (ast.kind !== Kind.STRING) { // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      throw new Error('JSONCustomScalarType can only parse string object values');
    }

    return ast.value;
  }
});