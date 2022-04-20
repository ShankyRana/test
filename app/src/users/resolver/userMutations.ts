import { Resolver, Arg, Ctx, Mutation, Authorized } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';

import { Context } from 'app/libs/request.interface';
import { User } from '../model/model';
import { UserService } from '../services/Users';
import { hashPassword } from '../helpers/password';
import { UserInput, TokenizedResponse } from '../type/Users';

@Resolver((of) => User)
export class UserMutations {
  // Graphql Mutations

  /**
   * create new user mutation
   *
   * @param email user's email address
   * @param password user's password
   * @param profile users's profile
   */
  @Mutation((returns) => TokenizedResponse, { nullable: false })
  async createUser(
    @Arg('email', { nullable: false }) email: string,
    @Arg('password', { nullable: false }) password: string,
    @Arg('role', { nullable: false }) role: string,
  ): Promise<any> {
    const user: any = {
      email,
      role,
      name: email?.substring(0, email.lastIndexOf('@')),
      password: await hashPassword(password), // eslint-disable-line @typescript-eslint/await-thenable
    };

    return UserService.createUser(user); // Calling services for database logic
  }

  /**
   * update user mutation
   *
   * @param user user's new info
   */
  @Authorized()
  @Mutation((returns) => User, { nullable: false })
  async updateUser(
    @Arg('user', (type) => UserInput, { nullable: false }) userInfo: UserInput,
    @Ctx() { req: { user } }: Context
  ): Promise<User> {

    if (userInfo.id !== user._id || !user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    const updatedUser: any = await UserService.fetchUser(user._id);
    this.copyProps(userInfo, updatedUser);


    if (userInfo.password) {
      updatedUser.password = await hashPassword(userInfo.password); // eslint-disable-line @typescript-eslint/await-thenable

    }


    const userId = updatedUser.id;
    delete updatedUser.id;

    return UserService.updateUser(userId, updatedUser); // Calling services for database logic
  }

  /**
   * delete user mutation
   *
   * @param context user's info
   */
  @Authorized()
  @Mutation((returns) => String, { nullable: false })
  deleteUser(
    @Ctx() { req: { user } }: Context
  ): string {

    if (!user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return UserService.deleteUser(user); // Calling services for database logic
  }

  private copyProps(from: any, to: any) {
    if (!from || !to) return;
    for (const key of Object.keys(from)) {
      if (typeof from[key] === 'object') {
        this.copyProps(from[key], to[key]);
      } else {
        to[key] = from[key];
      }
    }
  }
}
