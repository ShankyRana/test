import { CacheHint } from 'apollo-cache-control';
import { UseMiddleware } from 'type-graphql';

export const CacheControl = (hint: CacheHint): any => UseMiddleware(({ info }, next: any) => {
    console.log('Called CacheControl');
    info.cacheControl.setCacheHint(hint);
    return next();
  });