import { AuthenticationError, ApolloError } from 'apollo-server-express';

import jwt from 'jsonwebtoken';
import Fiber from 'fibers';

import appConfig from 'app/config';
import { checkPassword } from '../helpers/password';
import { User, Users } from '../model/model';
import { TokenizedResponse, CreateUserInput } from '../type/Users';





export class UserService {

  /**
   * creating user in database
   *
   * @param {*} user New user info
   */
  static async createUser(user: CreateUserInput): Promise<TokenizedResponse> {


    const newUser: any = new Users(user);

    const token: string = jwt.sign({ userId: newUser._id }, appConfig.jwtSecret, {
      expiresIn: '1h',
    });

    try {
      return {
        user: await newUser.save(),
        token,
        tokenExpiration: 1,
      };
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
  static fetchUser(_id: string): Promise<User> {
    try {
      return Users.findOne({ _id }).lean();
    } catch (error) {
      throw new ApolloError('User not found');
    }
  }

  /**
   * fetching users from database
   *
   * @param {*} teamId User's team id
   */
  static fetchUsers(teamId: string): Promise<User[]> {
    try {
      let query = {};
      if (teamId) {
        query = {
          $or: [
            {
              _id: teamId,
            },
            {
              teamId
            }
          ]
        };
      }

      const feilds = {
        _id: 1,
        email: 1,
        name: 1,
        createdAt: 1,
        role: 1,
      };

      return Users.find(query).select(feilds);

    } catch (error) {
      throw new ApolloError('User not found');
    }
  }

  /**
   * user service for update
   *
   * @param {*} userId User's unique id
   * @param {*} user User's new info
   */
  static updateUser(userId: string, user: User, checkDomain?: boolean): Promise<User> {
    try {


      return Users.findOneAndUpdate({ _id: userId }, { $set: user }, { new: true });

    } catch (error: any) {
      if (error?.extensions?.code === 'ValidationError') {
        throw error;
      } else {
        throw new ApolloError('User updation failed');
      }
    }
  }

  /**
   * user service for update
   *
   * @param {*} userId User's unique id
   * @param {*} teamId User's team Id
   * @param {*} doc Updatation fields
   */
  static updateUserWithTeam(userId: string, teamId: string, doc: any): Promise<User> { // eslint-disable-line
    try {
      return Users.updateMany({
        $or: [
          {
            _id: userId,
          },
          {
            teamId: userId,
          },
          {
            _id: teamId,
          },
        ],
      }, {
        $set: doc
      }, {
        new: true
      });
    } catch (error) {
      throw new ApolloError('Users updation failed');
    }
  }

  /**
   * login user with custom password check
   *
   * @param {*} email User's email address
   * @param {*} password User's password
   */
  static async loginUser(email: string, password: string): Promise<TokenizedResponse> {

    const user = await Users.findOne({
      'email': {
        '$regex': new RegExp('^' + email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$'), // eslint-disable-line
        '$options': 'i'
      }
    });

    console.log(user, '=-=->user');

    if (!user) {
      throw new AuthenticationError('Incorrect Email/Password');
    }

    if (user.deleted) {
      throw new AuthenticationError('Account Deleted');
    }

    const passwordCheck = await checkPassword(user, password);

    if (!passwordCheck.error) {
      const token = jwt.sign({ userId: user._id }, appConfig.jwtSecret, {
        expiresIn: '168h',
      });

      return {
        user,
        token,
        tokenExpiration: 1,
      };
    }

    throw new AuthenticationError('Incorrect Email/Password');
  }

  /**
   * delete user account with all services
   *
   * @param {*} user User's new info
   */
  static deleteUser(user: User): string {
    // deleting a user account, tries to delete from all services (intercom, fullstory etc..)
    const { _id: uid } = user;

    // should we remove transactions for delete user, or at least some info?
    // alltrans.remove({uid: this.userId})

    console.log('del acount: marking user as deleted');

    setTimeout(() => {
      Fiber(async () => {
        console.warn('really deleting user', uid);
        await Users.update({ _id: uid }, {
          $set: {
            deleted: true
          }
        });
      }).run();
    }, 1000);

    return 'ok';
  }

}
