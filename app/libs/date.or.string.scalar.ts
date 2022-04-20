import {GraphQLScalarType} from 'graphql';


export const DateOrStringScalar = new GraphQLScalarType({
  name: 'DateOrStringScalarType',
  description: 'Converts string date to Date',
  serialize: (value: any) => {
    if (value && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  },
  parseValue: (value: any) => {
    if (value && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  },
  parseLiteral: (ast: any) => ast.value
});