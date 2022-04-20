import { Resolver, Query, Arg, Ctx, Authorized } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';

import { CacheControl } from 'app/middleware/cache-control';
import { Context } from 'app/libs/request.interface';
import { Bike } from '../model/model';
import { BikesService } from '../services/Bikes';

@Resolver(of => Bike)
export class BikesQueries {

  // Graphql Queries

  /**
   * fetch user query
   *
   * @param _id user unique id
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => Bike, { nullable: true })
  fetchBike(
    @Arg('_id', { nullable: true }) _id: string,
    @Ctx() { req: { user } }: Context,
  ): Promise<Bike> {

    if (_id !== user._id || !user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BikesService.fetchBike(_id); // Calling services for database logic
  }

  /**
   * fetch users query
   *
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => [Bike], { nullable: true })
  fetchBikes(
    @Arg('teamId', { nullable: true }) teamId: string,
    @Ctx() { req: { user } }: Context,
  ): Promise<Bike[]> {

    if (!user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BikesService.fetchBikes(); // Calling services for database logic;
  }

}