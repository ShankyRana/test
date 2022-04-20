import { ApolloError } from 'apollo-server-express';

import { Bike } from 'app/src/bikes/model/model';
import { User } from 'app/src/users/model/model';
import { Booking, Bookings } from '../model/model';
import { CreateBookingInput, BookingOutput } from '../type/Bookings';


export class BookingsService {

  /**
   * creating Booking in database
   *
   * @param {*} booking New Booking info
   */
  static async createBooking(bike: CreateBookingInput): Promise<BookingOutput> {


    const newBooking: any = new Bookings(bike);

    try {
      const bookingValue = await newBooking.save();
      console.log(bookingValue, '=-=->bookingValue');

      return Bookings.findOne({ _id: bookingValue._id })
        .populate({ path: 'bookedBy', model: User })
        .populate({ path: 'bookedBike', model: Bike });

    } catch (error) {
      console.log(error, '=-=-=-eroe');

      throw new ApolloError('User already exists');
    }

  }

  /**
   * fetching user from database
   *
   * @param {*} _id User's unique id
   */
  static fetchBooking(_id: string): Promise<BookingOutput> {
    try {
      return Bookings.findOne({ _id })
        .populate({ path: 'bookedBy', model: User })
        .populate({ path: 'bookedBike', model: Bike });
    } catch (error) {
      throw new ApolloError('User not found');
    }
  }

  /**
   * fetching users from database
   *
   */
  static fetchBookings(userId: string): Promise<BookingOutput[]> {
    try {
      const query = userId ? { bookedBy: userId } : {};
      return Bookings.find(query)
        .populate({ path: 'bookedBy', model: User })
        .populate({ path: 'bookedBike', model: Bike });

    } catch (error) {
      throw new ApolloError('Booking not found');
    }
  }

  /**
   * Booking service for update
   *
   * @param {*} bikeId Booking's unique id
   * @param {*} bike Booking's new info
   */
  static updateBooking(bikeId: string, bike: Booking): Promise<BookingOutput> {
    try {

      return Bookings.findOneAndUpdate({ _id: bikeId }, { $set: bike }, { new: true });
    } catch (error: any) {
      if (error?.extensions?.code === 'ValidationError') {
        throw error;
      } else {
        throw new ApolloError('Booking updation failed');
      }
    }
  }

  /**
   * delete user account with all services
   *
   * @param {*} bike User's new info
   */
  static async deleteBooking(bikeId: string): Promise<string> {
    // deleting a bike account, tries to delete from all services (intercom, fullstory etc..)

    // should we remove transactions for delete bike, or at least some info?
    // alltrans.remove({uid: this.bikeId})

    console.log('del acount: marking bike as deleted');

    await Bookings.update({ _id: bikeId }, {
      $set: {
        deleted: true
      }
    });

    return 'ok';
  }

}
