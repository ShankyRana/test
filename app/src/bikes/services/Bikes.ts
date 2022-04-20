import { ApolloError } from 'apollo-server-express';

import { Bike, Bikes } from '../model/model';
import { CreateBikeInput } from '../type/Bikes';


export class BikesService {

  /**
   * creating Bike in database
   *
   * @param {*} bike New Bike info
   */
  static createBike(bike: CreateBikeInput): Promise<Bike> {


    const newBike: any = new Bikes(bike);

    try {
      return newBike.save();
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
  static fetchBike(_id: string): Promise<Bike> {
    try {
      return Bikes.findOne({ _id }).lean();
    } catch (error) {
      throw new ApolloError('User not found');
    }
  }

  /**
   * fetching users from database
   *
   */
  static fetchBikes(): Promise<Bike[]> {
    try {
      return Bikes.find();

    } catch (error) {
      throw new ApolloError('Bike not found');
    }
  }

  /**
   * Bike service for update
   *
   * @param {*} bikeId Bike's unique id
   * @param {*} bike Bike's new info
   */
  static updateBike(bikeId: string, bike: Bike): Promise<Bike> {
    try {

      return Bikes.findOneAndUpdate({ _id: bikeId }, { $set: bike }, { new: true });
    } catch (error: any) {
      if (error?.extensions?.code === 'ValidationError') {
        throw error;
      } else {
        throw new ApolloError('Bike updation failed');
      }
    }
  }

  /**
   * delete user account with all services
   *
   * @param {*} bike User's new info
   */
  static async deleteBike(bikeId: string): Promise<string> {
    // deleting a bike account, tries to delete from all services (intercom, fullstory etc..)

    // should we remove transactions for delete bike, or at least some info?
    // alltrans.remove({uid: this.bikeId})

    console.log('del acount: marking bike as deleted');

    await Bikes.update({ _id: bikeId }, {
      $set: {
        deleted: true
      }
    });

    return 'ok';
  }

}
