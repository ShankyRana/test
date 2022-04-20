import { Resolver, Arg, Ctx, Mutation, Authorized } from 'type-graphql';
import { ObjectID } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

import { Context } from 'app/libs/request.interface';
import { Bike } from '../model/model';
import { BikesService } from '../services/Bikes';
import { BikesInput } from '../type/Bikes';

@Resolver((of) => Bike)
export class BikesMutations {
  // Graphql Mutations

  /**
   * create new user mutation
   *
   * @param email user's email address
   * @param password user's password
   * @param profile users's profile
   */
  @Authorized()
  @Mutation((returns) => Bike, { nullable: false })
  async createBike(
    @Arg('name', { nullable: false }) name: string,
    @Arg('color', { nullable: false }) color: string,
    @Arg('location', { nullable: false }) location: string,
    @Arg('availability', { nullable: true }) availability: boolean,
    @Ctx() { req: { user } }: Context
  ): Promise<Bike> {
    console.log(user, '=-=->user');

    if (!user && user?.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    const bike: any = {
      _id: new ObjectID(),
      name,
      color,
      location,
      availability
    };

    return BikesService.createBike(bike); // Calling services for database logic
  }

  /**
   * update user mutation
   *
   * @param user user's new info
   */
  @Authorized()
  @Mutation((returns) => Bike, { nullable: false })
  async updateBike(
    @Arg('bike', (type) => BikesInput, { nullable: false }) bikeInfo: BikesInput,
    @Ctx() { req: { user } }: Context
  ): Promise<Bike> {

    if (!user && user?.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }
    const bikeIn = await BikesService.updateBike(bikeInfo._id, bikeInfo);
    console.log(bikeIn, '=-=-=>bikeIn');

    return bikeIn; // Calling services for database logic
  }

  /**
   * delete bike mutation
   *
   * @param context user's info
   */
  @Authorized()
  @Mutation((returns) => String, { nullable: false })
  deleteBike(
    @Arg('bikeId', { nullable: false }) bikeId: string,
    @Ctx() { req: { user } }: Context
  ): Promise<string> {

    if (!user && user?.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return BikesService.deleteBike(bikeId); // Calling services for database logic
  }
}
