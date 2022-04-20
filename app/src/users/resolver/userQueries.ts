import { Resolver, Query, Arg, Ctx, Authorized } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';

import { CacheControl } from 'app/middleware/cache-control';
import { Context } from 'app/libs/request.interface';
import { User } from '../model/model';
import { UserService } from '../services/Users';
import { TokenizedResponse } from '../type/Users';

@Resolver(of => User)
export class UserQueries {

  // Graphql Queries

  /**
   * fetch user query
   *
   * @param _id user unique id
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => User, { nullable: true })
  async fetchUser(
    @Ctx() { req: { user } }: Context,
  ): Promise<User> {

    if (!user) {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return UserService.fetchUser(user._id); // Calling services for database logic
  }

  /**
   * fetch users query
   *
   * @param teamId teams unique id
   * @param context request context with user
   */
  @Authorized()
  @CacheControl({ maxAge: 60 }) // here we declare that ApolloEngine will cache the query for 60s
  @Query(returns => [User], { nullable: true })
  async fetchUsers(
    @Arg('teamId', { nullable: true }) teamId: string,
    @Ctx() { req: { user } }: Context,
  ): Promise<User[]> {

    if (!user || user.role !== 'manager') {
      throw new ApolloError('User not authorized.', 'ForbiddenError');
    }

    return UserService.fetchUsers(teamId); // Calling services for database logic;
  }

  /**
   * user login query
   *
   * @param email user's email address
   * @param password user's password
   */
  @Query(returns => TokenizedResponse, { nullable: true })
  async loginUser(
    @Arg('email', { nullable: false }) email: string,
    @Arg('password', { nullable: false }) password: string,
  ): Promise<TokenizedResponse> {
    return UserService.loginUser(email, password); // Calling services for database logic
  }

}