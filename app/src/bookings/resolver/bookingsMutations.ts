import { Resolver, Arg, Ctx, Mutation, Authorized } from 'type-graphql';
import { ObjectID } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

import { Context } from 'app/libs/request.interface';
import { Booking } from '../model/model';
import { BookingsService } from '../services/Bookings';
import { BookingsInput, BookedSlotInput, BookingOutput } from '../type/Bookings';

@Resolver((of) => Booking)
export class BookingsMutations {
  // Graphql Mutations

  /**
   * create new user mutation
   *
   * @param email user's email address
   * @param password user's password
   * @param profile users's profile
   */
  @Authorized()
  @Mutation((returns) => BookingOutput, { nullable: false })
  createBooking(
    // @Arg('name', { nullable: false }) name: string,
    // @Arg('bookedBy', { nullable: false }) bookedBy: string,
    @Arg('bookedBike', { nullable: false }) bookedBike: string,
    @Arg('bookedSlot', { nullable: true }) bookedSlot: BookedSlotInput,
    @Ctx() { req: { user } }: Context
  ): Promise<BookingOutput> {
    const booking: any = {
      _id: new ObjectID(),
      name: `${user.name}-${bookedBike}`,
      bookedBy: user._id,
      bookedBike,
      bookedSlot
    };

    return BookingsService.createBooking(booking); // Calling services for database logic
  }

  /**
   * update user mutation
   *
   * @param user user's new info
   */
  @Authorized()
  @Mutation((returns) => BookingOutput, { nullable: false })
  async updateBooking(
    @Arg('booking', (type) => BookingsInput, { nullable: false }) bookingInfo: BookingsInput,
    @Ctx() { req: { user } }: Context
  ): Promise<BookingOutput> {

    if (!user && user?.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BookingsService.updateBooking(bookingInfo._id, bookingInfo); // Calling services for database logic
  }

  /**
   * delete booking mutation
   *
   * @param context user's info
   */
  @Authorized()
  @Mutation((returns) => String, { nullable: false })
  deleteBooking(
    @Arg('bookingId', { nullable: false }) bookingId: string,
    @Ctx() { req: { user } }: Context
  ): Promise<string> {

    if (!user && user?.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BookingsService.deleteBooking(bookingId); // Calling services for database logic
  }
}
