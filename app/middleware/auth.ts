/**
 * Define middlerware for extracting authToken
 */

import { AuthChecker } from 'type-graphql';
import * as jwt from 'jsonwebtoken';

import config from 'app/config';
import { Users } from 'app/src/users/model/model';
import { Context, ConnectionContext } from 'app/libs/request.interface';

export const authCheckerSubscription = (connectionParams: ConnectionContext): boolean => {

  if (!connectionParams) {
    return false;
  }

  const authHeader: string = connectionParams.Authorization;

  if (!authHeader) {
    return false;
  }

  const token: string = authHeader.split(' ')[1];

  if (!token || token === '') {
    return false;
  }

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return false;
    }

    if (!decodedToken) {
      return false;
    }

    return true;


};

export const authChecker: AuthChecker<Context> = async ({ context: { req } }, roles) => {

  if (!req) {
    return false;
  }

  const authHeader: string = req.get('Authorization');

  if (!authHeader && !roles.includes('CLIENT')) {
    return false;
  }

  if (authHeader) {
    const token: string = authHeader.split(' ')[1];

    if (!token || token === '') {
      return false;
    }

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return false;
    }

    if (!decodedToken) {
      return false;
    }

    req.user = await Users.findOne({ _id: decodedToken.userId });
    req.userId = decodedToken.userId;

    return req;

  } if (roles.includes('CLIENT')) {
    return req;
  }
  return false;


};