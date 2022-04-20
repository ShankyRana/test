import { Resolver, Query, Arg, Ctx, Authorized } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';

import { CacheControl } from 'app/middleware/cache-control';
import { Context } from 'app/libs/request.interface';
import { Booking } from '../model/model';
import { BookingsService } from '../services/Bookings';
import { BookingOutput } from '../type/Bookings';

@Resolver(of => Booking)
export class BookingsQueries {

  // Graphql Queries

  /**
   * fetch user query
   *
   * @param _id user unique id
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => BookingOutput, { nullable: true })
  fetchBooking(
    @Arg('_id', { nullable: true }) _id: string,
    @Ctx() { req: { user } }: Context,
  ): Promise<BookingOutput> {

    if (_id !== user._id || !user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BookingsService.fetchBooking(_id); // Calling services for database logic
  }

  /**
   * fetch users query
   *
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => [BookingOutput], { nullable: true })
  fetchBookings(
    @Ctx() { req: { user } }: Context,
  ): Promise<BookingOutput[]> {
    console.log(user, '=--==>user');

    if (!user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BookingsService.fetchBookings(user.role === 'manager' ? '' : user._id); // Calling services for database logic;
  }

}